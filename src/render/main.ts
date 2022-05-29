import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import {
  BiPauseFill,
  BiPlayFill,
  BiRecordCircle,
  BiStopFill,
  HiCheck,
  HiSelector,
  HiSolidCog,
  RiLoader2Fill,
} from 'oh-vue-icons/icons'
import App from './App.vue'
import { router } from './routes'
import 'animate.css'
import './index.css'

addIcons(
  RiLoader2Fill,
  BiRecordCircle,
  BiPlayFill,
  BiStopFill,
  BiPauseFill,
  HiSelector,
  HiCheck,
  HiSolidCog,
)

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(Toast, {
  transition: 'Vue-Toastification__fade',
  maxToasts: 4,
  newestOnTop: false,
})
app.component('Icon', OhVueIcon)
app.mount('#app')
