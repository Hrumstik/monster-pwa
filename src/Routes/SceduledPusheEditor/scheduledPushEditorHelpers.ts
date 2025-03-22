import moment from "moment-timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const generateTimezones = () => {
  return moment.tz.names().map((tz) => {
    const offsetMinutes = moment.tz(tz).utcOffset();
    const hours = Math.floor(offsetMinutes / 60);
    const minutes = Math.abs(offsetMinutes % 60);
    const sign = hours >= 0 ? "+" : "-";
    const formattedOffset = `${sign}${String(Math.abs(hours)).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}`;

    return {
      label: `(UTC${formattedOffset}) ${tz}`,
      value: tz,
    };
  });
};

export const timezones = generateTimezones().sort((a, b) =>
  a.label.localeCompare(b.label)
);

export const defaultTimezone = timezones.find(
  (timezone) => timezone.value === moment.tz.guess()
);

export function generateDates({
  hours,
  minutes,
  days,
  start,
  end,
  timeZone,
}: {
  hours: number;
  minutes: number;
  days: number[];
  start: string;
  end: string;
  timeZone: string;
}): string[] {
  let startDate = new Date(start);
  let endDate = new Date(end);

  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  const result: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (days.includes(currentDate.getDay())) {
      const dateWithTime = new Date(currentDate);
      dateWithTime.setHours(hours);
      dateWithTime.setMinutes(minutes);

      if (dateWithTime >= startDate && dateWithTime <= endDate) {
        result.push(dayjs(dateWithTime).tz(timeZone, true).toISOString());
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}
