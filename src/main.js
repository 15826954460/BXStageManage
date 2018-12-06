// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/comment.css'
import './style/reset.css'
import 'swiper/dist/css/swiper.css'
import './untils/filter'
import moment from 'moment'
import VueDND from 'awe-dnd'
Vue.use(VueDND)
Vue.prototype.$moment = moment
Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
