import '@/assets/main.less'
import 'tdesign-mobile-vue/es/style/index.css'
import 'vant/lib/index.css'
import './styles/tailwind.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
// 初始化 viewport
import './utils/viewport'

import './plugin/permission'

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
