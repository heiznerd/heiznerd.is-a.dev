import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initSmoother, refreshWhenSettled } from './lib/gsap'
import { vMagnetic } from './directives/magnetic'

const preferred = localStorage.getItem('preferred-lang') === 'en' ? 'en' : 'vi'
document.documentElement.lang = preferred

// GSAP guidance: the ScrollSmoother must exist before any ScrollTrigger is created,
// so it is set up before the app (and its components' ScrollTriggers) mounts.
initSmoother()

const app = createApp(App)
app.directive('magnetic', vMagnetic)
app.use(router)
app.mount('#app')

refreshWhenSettled()
