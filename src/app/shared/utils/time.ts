export function getMonthNameFromIndex(monthIndex) {
  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
  ];
  return months[monthIndex];
}

export function dateToString(date: Date) {
  if(!date) {
    return date;
  }
  date = new Date(date)
  return `${ String(date.getFullYear()) }-${ String(date.getMonth() + 1).padStart(2, '0') }-${ String(date.getDate()).padStart(2, '0') }`
}
