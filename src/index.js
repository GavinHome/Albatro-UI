import AlButton from "~/button";
import locale from "element-ui/src/locale";

const components = [AlButton];

const componentsName = ["AlButton"];

const install = function(Vue, opts) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  // 判断是否安装，安装过就不继续往下执行
  if (install.installed) return;
  install.installed = true;

  components.map((component, i) => {
    Vue.component(componentsName[i], component);
  });

  Vue.prototype.$ALBATRO = {
    size: opts.size || "",
    zIndex: opts.zIndex || 2000
  };
};

// 检测到 Vue 才执行，毕竟我们是基于 Vue 的
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  version: "0.1.0",
  locale: locale.use,
  i18n: locale.i18n,
  install,
  //AlButton,
  ...components
};
