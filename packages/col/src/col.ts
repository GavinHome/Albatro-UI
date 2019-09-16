
import Vue, { VNode } from "vue";

export default Vue.extend({
    name: "AlCol",
    props: {
        span: {
            type: Number,
            default: 24
        },
        tag: {
            type: String,
            default: 'div'
        },
        offset: Number,
        xs: [Number, Object],
        sm: [Number, Object],
        md: [Number, Object],
        lg: [Number, Object],
        xl: [Number, Object]
    },
    methods: {
        getProp(prop: string): any {
            return (this as any)[prop];
        }
    },
    computed: {
        gutter(): number {
            let parent = this.$parent;

            while (parent && parent.$options.name !== 'AlRow') {
                parent = parent.$parent;
            }
            return parent ? (parent as any).margin : 0;
        },
        style() {
            let style = {
                paddingLeft: '0px',
                paddingRight: '0px'
            };

            if (this.gutter) {
                style.paddingLeft = this.gutter / 2 + 'px';
                style.paddingRight = style.paddingLeft;
            }

            return style;
        },
        classList(): string[] {
            let class_prefix = "al-col";
            let classList: string[] = [];

            ['span', 'offset'].forEach(prop => {
                var props = this.getProp(prop);
                if (props || props === 0) {
                  classList.push(prop !== 'span' ? `${class_prefix}-${prop}-${props}` : `${class_prefix}-${this[prop]}`);
                }
              });

            ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
                var props = this.getProp(size);
                if (typeof props === 'number') {
                    classList.push(`${class_prefix}-${size}-${props}`);
                } else if (typeof props === 'object') {
                    Object.keys(props).forEach(prop => {
                        classList.push(prop !== 'span' ? `${class_prefix}-${size}-${prop}-${props[prop]}` : `${class_prefix}-${size}-${props[prop]}`);
                    });
                }
            });

            return classList;
        }
    },
    render(createElement): VNode {
        return createElement(this.tag, {
            class: [
                'al-col',
                this.classList
            ],
            style: this.style
        }, this.$slots.default)
    }
})

