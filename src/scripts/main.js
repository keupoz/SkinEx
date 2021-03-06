import 'babel-polyfill'

import './utils'

import Vue from 'vue'

import ColorWheel from '../components/ColorWheel.vue'
import IconButton from '../components/IconButton.vue'
import VCheckbox  from '../components/Checkbox.vue'
import VRange     from '../components/Range.vue'
import VSelect    from '../components/Select.vue'

import AppComponent   from '../components/App.vue'
import AppClass       from './app/App'

import registerPixels  from './config/pixels'
import registerServers from './config/servers'

// VUE INIT

// Register some components globally
Vue.component('ColorWheel', ColorWheel);
Vue.component('IconButton', IconButton);
Vue.component('VCheckbox',  VCheckbox);
Vue.component('VRange',     VRange);
Vue.component('VSelect',    VSelect);

// APP INIT
const App = new AppClass();
registerPixels(App.pixels);
registerServers(App.server);
// Make App instance reactive
Vue.observable(App);
// Make App instance available in all Vue instances
Vue.prototype.$app = App;

// APP COMPONENT INIT
new Vue({
  el: '#app',
  render: h => h(AppComponent)
});
