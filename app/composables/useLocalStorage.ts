export function useLocalStorage() {
  const getItem = (itemName: string) => {
    return import.meta.client && localStorage.getItem(itemName)
  }

  const setItem = (itemName: string, value: string) => {
    localStorage.setItem(itemName, value)
  }
  const removeItem = (itemName: string) => {
    return localStorage.removeItem(itemName)
  }

  return { getItem, setItem, removeItem }
}
