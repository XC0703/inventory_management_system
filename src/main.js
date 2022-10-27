import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import 'normalize.css'
import './style/index.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import mitt from 'mitt'

const app = createApp(App)
// app.use(store);
app.use(router);
app.use(ElementPlus)
app.config.globalProperties.$bus = new mitt() // event Bus 用于无关系组件间的通信
app.mount('#app')