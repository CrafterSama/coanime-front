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
