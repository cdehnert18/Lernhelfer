import { computed } from 'vue';


export function useWochentag(date : Date) {
  const wochentage = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ];

  const wochentag = computed(() => {
    const dayIndex = date.getDay();
    return wochentage[dayIndex];
  });

  return {
    wochentag,
  };
}