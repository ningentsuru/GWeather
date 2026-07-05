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

  const userLogin = async (body: { email: string; password: string }) => {
    return await apiFetch('/api/login', {
      method: 'post',
      body,
    })
  }

  const userSignup = async (body: { email: string; name: string; password: string }) => {
    return await apiFetch('/api/signup', {
      method: 'post',
      body,
    })
  }

  const getUserHistory = async (page: number = 1, limit: number = 10) => {
    return await apiFetch('/api/weather/user-history', {
      method: 'get',
      query: {
        page,
        limit,
      },
    })
  }

  return {
    getCityWeather,
    getCurrentLocationWeather,
    userLogin,
    userSignup,
    getUserHistory,
  }
}
