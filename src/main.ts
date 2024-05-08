import {createApp} from 'vue'
import App from './App.vue'
import i18n from './i18n'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './styles/base.css'
import router from './router'

const app = createApp(App)
app.use(i18n)
app.use(router)

app.mount('#app')
