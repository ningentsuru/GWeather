<template>
  <header class="container mx-auto px-4 flex items-center justify-between h-16">
    <h1 class="text-2xl"><nuxt-link to="/">GWeather</nuxt-link></h1>
    <nav class="flex gap-4 items-center">
      <nuxt-link to="/">Current Weather</nuxt-link>
      <nuxt-link to="/weather-lists">Weather Lists</nuxt-link>
      <nuxt-link to="/login">Login & Signup</nuxt-link>
      <ThemeToggle />
    </nav>
  </header>
</template>
