import Vue, { VNode } from "vue";
import { Component, Prop } from 'vue-property-decorator';
import AlbatroUIComponent from "~/AlbatroUIComponent";

@Component({
    name: "AlMain"
})
export default class AlMain extends AlbatroUIComponent {
    @Prop({ default: "60px", type: String }) private height!: string;

    render(h: Vue.CreateElement): VNode {
        return h("main", {
            class: [
                'al-main'
            ],
            style: {
                height: this.height
            }
        }, this.$slots.default)
    }

    install(vue: Vue.VueConstructor<Vue>): void {
        vue.component("AlMain", AlMain)
    }
}