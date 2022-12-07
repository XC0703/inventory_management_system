import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './style/index.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import mitt from 'mitt'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

// 引入echarts
import * as echarts from 'echarts'
app.config.globalProperties.$echarts = echarts
app.use(store);
app.use(router);
app.config.globalProperties.$bus = new mitt() // event Bus 用于无关系组件间的通信
app.use(ElementPlus, {locale: zhCn,}) //汉化
app.mount('#app')