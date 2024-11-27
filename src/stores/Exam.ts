import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Pruefung {
    fach: string;
    date: Date;
}

export const usePruefungenStore = defineStore('pruefungen', () => {
  const pruefungen = ref<Pruefung[]>([]);

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem('pruefungen');
    pruefungen.value = data
      ? JSON.parse(data).map((item: { fach: string; date: string }) => ({
          fach: item.fach,
          date: new Date(item.date),
        }))
      : [];
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('pruefungen', JSON.stringify(pruefungen.value));
  };

  const addPruefung = (pruefung: Pruefung) => {
    pruefungen.value.push(pruefung);
    saveToLocalStorage();
  };

  const removePruefung = (index: number) => {
    pruefungen.value.splice(index, 1);
    saveToLocalStorage();
  };

  return {
    pruefungen,
    loadFromLocalStorage,
    saveToLocalStorage,
    addPruefung,
    removePruefung,
  };
});