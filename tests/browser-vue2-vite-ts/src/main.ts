import Vue from 'vue'
import App from './App.vue'
import './style.css'

const app = new Vue({
  render:(h) => h(App),
});

app.$mount('#app')
