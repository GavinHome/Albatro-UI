import Vue from "vue";
import Router from "vue-router";
//import Home from "./views/Home.vue";
import routes from './route.config';

Vue.use(Router);

var router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
});

router.afterEach((route: any) => {
  var title = require("./i18n/title");
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  // Vue.nextTick(() => {
  //   const blocks = document.querySelectorAll('pre code:not(.hljs)');
  //   Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  // });
  const data = title[route.meta.lang];
  for (let val in data) {
    if (new RegExp('^' + val, 'g').test(route.name)) {
      document.title = data[val];
      return;
    }
  }
  document.title = 'AlbatroUI';
  //ga('send', 'event', 'PageView', route.name);
});

export default router;

// var routes = [
//   {
//     path: "/",
//     name: "home",
//     component: Home
//   },
//   {
//     path: "/about",
//     name: "about",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () =>
//       import(/* webpackChunkName: "about" */ "./views/About.vue")
//   }
// ]
