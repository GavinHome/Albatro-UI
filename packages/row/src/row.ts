
import Vue, { VNode } from "vue";

export default Vue.extend({
    name: "AlRow",
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        margin: Number,
        flex: Boolean,
        horizontalAlign: {
            type: String,
            default: 'start'
        },
        verticalAlign: {
            type: String,
            default: 'top'
        }
    },
    methods: {
    },

    computed: {
        style() {
            const ret = {
                marginLeft: '0px',
                marginRight: '0px'
            };

            if (this.margin) {
                ret.marginLeft = `-${this.margin / 2}px`;
                ret.marginRight = ret.marginLeft;
            }

            return ret;
        }
    },

    render(createElement): VNode {
        return createElement(this.tag, {
            class: [
                'al-row',
                this.horizontalAlign !== 'start' ? `is-horizontal-${this.horizontalAlign}` : '',
                this.verticalAlign !== 'top' ? `is-vertical-${this.verticalAlign}` : '',
                { 'al-row--flex': this.flex }
            ],
            style: this.style
        }, this.$slots.default)
    }
})

