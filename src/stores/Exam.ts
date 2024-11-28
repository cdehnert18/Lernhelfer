import { defineStore } from 'pinia';
import { ref,watch } from 'vue';

export interface Pruefung {
    fach: string;
    date: Date;
}

export const usePruefungenStore = defineStore('pruefungen', () => {
  const pruefungen = ref<Pruefung[]>([]);

  watch(pruefungen,(newPruefungen) => {
    localStorage.setItem('pruefungen', JSON.stringify(newPruefungen));
  }, {deep: true})

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem('pruefungen');
    pruefungen.value = data
      ? JSON.parse(data).map((item: { fach: string; date: string }) => ({
          fach: item.fach,
          date: new Date(item.date),
        }))
      : [];
  };

  const addPruefung = (pruefung: Pruefung) => {
    pruefungen.value.push(pruefung);
  };

  const removePruefung = (index: number) => {
    pruefungen.value.splice(index, 1);
  };

  return {
    pruefungen,
    loadFromLocalStorage,
    addPruefung,
    removePruefung,
  };
});