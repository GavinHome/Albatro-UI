import AlButton from "~/button/src/button.vue"; // ~ is an alias to /packages

/* istanbul ignore next */
AlButton.prototype.install = function (Vue: any) {
    Vue.component(AlButton.name, AlButton);
};

export default AlButton;
