import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less'
import 'amfe-flexible'
import vant from 'vant'
import 'vant/lib/index.less'
import TouTiaoicon from '@/components/TouTiaoicon'
// import request from '@/utils/request'

// request.get('/v1_0/channels').then((res) => {
//   console.log(res)
// })
import './utils/dayjs'
Vue.config.productionTip = false
Vue.use(vant)
Vue.component('TouTiaoicon', TouTiaoicon)
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
