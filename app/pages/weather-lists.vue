<script setup lang="ts">
import { ref } from 'vue'

interface HistoryItem {
  city: string;
  temp: number;
  description: string;
  fetchedAt: Date;
}

const history = ref<HistoryItem[]>([]);
</script>

<template>
  <div class="weather-history">
    <h3>Weather History</h3>
    <ul v-if="history?.length">
      <li v-for="(item, idx) in history" :key="idx">
        <strong>{{ item.city }}</strong> - {{ item.temp }}°C ({{
          item.description
        }})
        <br />
        <small>{{ item.fetchedAt }}</small>
      </li>
    </ul>
    <p v-else>No weather data fetched yet.</p>
  </div>
</template>
