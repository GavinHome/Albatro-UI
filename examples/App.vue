<template>
  <div id="app">
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

@Component({
  components: {
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

  @Watch("lang", { immediate: true, deep: true })
  onLangChanged(val: string, oldVal: string) {
    this.localize(val);
  }
}
</script>
