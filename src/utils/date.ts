import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/es';

dayjs.extend(utc);

/**
 * Format date as "Octubre 3, 1979" (month, day, year in Spanish).
 * @param useUtc - If true, interpret value as UTC before formatting (e.g. for broadTime).
 */
export function formatLocaleDate(
  value: string | Date | number | null | undefined,
  useUtc = false
): string {
  if (value == null) return '';
  let d = dayjs(value).locale('es');
  if (useUtc) d = d.utc();
  if (!d.isValid()) return '';
  const s = d.format('MMMM D, YYYY');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const getDay = () => {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  // eslint-disable-next-line
  const options = {
    formatMatcher: 'best fit',
    weekday: 'long', //, year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    hour12: false,
  };
  const currentDate = new Date(); // .toLocaleTimeString('en-us', options)
  const weekdayValue = currentDate.getDay();
  const today = days[weekdayValue];

  return today;
};
