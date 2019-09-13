import AlButton from "~/button";

const components = [AlButton];

const componentsName = ["AlButton"];

const install = function(Vue, opts) {
  // 判断是否安装，安装过就不继续往下执行
  if (install.installed) return;
  install.installed = true;

  components.map((component, i) => {
    Vue.component(componentsName[i], component);
  });
};

// 检测到 Vue 才执行，毕竟我们是基于 Vue 的
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  //AlButton,
  ...components
};
