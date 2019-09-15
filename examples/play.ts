import Vue from "vue";
import App from "./play/index.vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import AlbatroUI from "~/index";
import "~/theme-albatro/src/index.scss";
Vue.use(AlbatroUI);

// import AlButton from "~/index";
// import "~/theme-albatro/src/button.scss";
// Vue.use(AlButton);

new Vue({
  render: h => h(App)
}).$mount("#app");
