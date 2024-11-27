//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'

const setTheme = () => {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  if (darkModeQuery.matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light')
  }
}

setTheme()
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', setTheme)

const app = createApp(App)

app.use(router)
const pinia = createPinia()
app.use(pinia)

app.mount('#app')
