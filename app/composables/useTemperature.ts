export const useTemperature = () => {
  const toFahrenheit = (celcius: number, decimal: number) => {
    return ((celcius * 9) / 5 + 32).toFixed(decimal)
  }

  return {
    toFahrenheit,
  }
}
