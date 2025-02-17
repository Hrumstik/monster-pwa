import { PushFilters, TriggerEvent } from "@models/push";
import moment from "moment";

export const generateDaysOptions = (maxDays: number) => {
  return Array.from({ length: maxDays + 1 }, (_, i) => ({
    value: i * 24 * 60 * 60,
    label: `${i} ${i === 1 ? "день" : "дней"}`,
  }));
};

export const generateHoursOptions = (maxHours: number) => {
  return Array.from({ length: maxHours + 1 }, (_, i) => ({
    value: i * 60 * 60,
    label: `${i} ${i === 1 ? "час" : "часов"}`,
  }));
};

export const generateMinutesOptions = (maxMinutes: number) => {
  return Array.from({ length: maxMinutes + 1 }, (_, i) => ({
    value: i * 60,
    label: `${i} ${i === 1 ? "минута" : "минут"}`,
  }));
};

export const generateSecondsOptions = (maxSeconds: number) => {
  return Array.from({ length: maxSeconds + 1 }, (_, i) => ({
    value: i,
    label: `${i} ${i === 1 ? "секунда" : "секунд"}`,
  }));
};

export const registrationFiltersOptions = [
  { value: PushFilters.All, label: "Отправлять всем" },
  { value: PushFilters.With, label: "Только тем, у кого были регистрации" },
  {
    value: PushFilters.Without,
    label: "Только тем, у кого не было регистраций",
  },
];

export const depositFiltersOptions = [
  { value: PushFilters.All, label: "Отправлять всем" },
  { value: PushFilters.With, label: "Только тем, у кого были депозиты" },
  {
    value: PushFilters.Without,
    label: "Только тем, у кого не было депозитов",
  },
];

function getPluralForm(
  value: number,
  one: string,
  few: string,
  many: string
): string {
  if (value % 10 === 1 && value % 100 !== 11) return one;
  if (
    value % 10 >= 2 &&
    value % 10 <= 4 &&
    (value % 100 < 10 || value % 100 >= 20)
  )
    return few;
  return many;
}

export function convertSeconds(seconds: number): string {
  const duration = moment.duration(seconds, "seconds");

  const parts = [];
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const secs = duration.seconds();

  if (days > 0)
    parts.push(`${days} ${getPluralForm(days, "день", "дня", "дней")}`);
  if (hours > 0)
    parts.push(`${hours} ${getPluralForm(hours, "час", "часа", "часов")}`);
  if (minutes > 0)
    parts.push(
      `${minutes} ${getPluralForm(minutes, "минута", "минуты", "минут")}`
    );
  if (secs > 0)
    parts.push(
      `${secs} ${getPluralForm(secs, "секунда", "секунды", "секунд")}`
    );

  return parts.join(" ");
}

export function getPushTriggerEventName(event: TriggerEvent): string {
  switch (event) {
    case TriggerEvent.Registration:
      return "Регистрация";
    case TriggerEvent.Deposit:
      return "Депозит";
    case TriggerEvent.Install:
      return "Установка";
  }
}
