// composables/useWeather.ts
import { ref } from "vue";

export function useWeather() {
  const currentWeather = ref<any>(null);
  const weatherHistory = ref<any[]>([]);

  const fetchWeather = async (city: string) => {
    try {
      // Calls your server API, not OpenWeather directly
      const data = await $fetch("/api/weather", { query: { city } });

      currentWeather.value = data;

      const exists = weatherHistory.value.some(
        (item) => item.city === data.city && item.fetchedAt === data.fetchedAt,
      );

      if (!exists) {
        weatherHistory.value.unshift(data);
        localStorage.setItem(
          "weatherHistory",
          JSON.stringify(weatherHistory.value),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = () => {
    const stored = localStorage.getItem("weatherHistory");
    if (stored) weatherHistory.value = JSON.parse(stored);
  };

  return { currentWeather, weatherHistory, fetchWeather, loadHistory };
}
