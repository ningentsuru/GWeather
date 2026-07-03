export function useApi() {
  const apiFetch = async (url: string, options: object) => {
    return await $fetch(url, options)
  }

  const getCityWeather = async (params: { city: string }) => {
    return await apiFetch('/api/weather/queryparams', {
      method: 'get',
      params,
    })
  }

  const getCurrentLocationWeather = async (params: { lat: number; lon: number }) => {
    return await apiFetch('/api/weather/coordinates', {
      method: 'get',
      params,
    })
  }

  return {
    getCityWeather,
    getCurrentLocationWeather,
  }
}
