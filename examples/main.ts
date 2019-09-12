import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import '~/theme-albatro/src/index.scss';
import './demo-styles/index.scss';
import './assets/styles/common.css';
import './assets/styles/fonts/style.css';

// import AlbatroUI from "~/index";
// Vue.use(AlbatroUI);

// import AlButton from "~/index";
// import "~/theme-albatro/src/index.scss";

// Vue.use(AlButton);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
