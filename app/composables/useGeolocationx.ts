export function useGeolocation() {
  const coords = ref({ latitude: 0, longitude: 0 });
  const error = ref<string | null>(null);
  const loading = ref(false);

  const getPosition = () => {
    if (!navigator.geolocation) {
      error.value = "Geolocation is not supported";
      return;
    }

    loading.value = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        loading.value = false;
      },
      (err) => {
        error.value = err.message;
        loading.value = false;
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  };

  return { coords, error, loading, getPosition };
}
