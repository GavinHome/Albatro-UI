<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />-->
    <main-header v-if="lang !== 'play'"></main-header>
    <div class="main-cnt">
      <router-view></router-view>
    </div>
    <main-footer v-if="lang !== 'play' && !isComponent"></main-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
//import { use } from "../src/locale";
//import zhLocale from "../src/locale/lang/zh-CN";

import MainFooter from "./components/footer.vue";
import MainHeader from "./components/header.vue";

@Component({
  components: {
    MainHeader,
    MainFooter
  }
})
export default class App extends Vue {
  get lang() {
    return this.$route.path.split("/")[1] || "zh-CN";
  }
  get isComponent() {
    return /^component-/.test(this.$route.name || "");
  }

  created() {
    const lang = location.hash.replace("#", "").split("/")[1] || "zh-CN";
    this.localize(lang);
  }

  mounted() {
    this.localize(this.lang);
  }

  localize(lang: any) {
    // switch (lang) {
    //   case "zh-CN":
    //     use(zhLocale);
    //     break;
    //   default:
    //     use(zhLocale);
    // }
  }

  @Watch("person", { immediate: true, deep: true })
  onPersonChanged1(val: string, oldVal: string) {
    this.localize(val);
  }
}
</script>

<style lang="scss">
// #app {
//   font-family: "Avenir", Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
// #nav {
//   padding: 30px;
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
