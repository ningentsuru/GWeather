import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export function useDateFormat() {
  const unixAndTimezoneFormat = (unix: number, timezone: number, format?: string) => {
    const offsetMinutes = timezone / 60
    return dayjs.unix(unix).utc().utcOffset(offsetMinutes).format(format)
  }

  return { unixAndTimezoneFormat }
}
