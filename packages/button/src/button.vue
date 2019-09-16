<template>
  <button
    class="al-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'al-button--' + type : '',
      buttonSize ? 'al-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="al-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";

@Component({
  name: "AlButton",
})
export default class AlButton extends Vue {
  @Prop() private type!: string;
  @Prop() private size!: string;
  @Prop() private icon!: string;
  @Prop() private nativeType!: string;
  @Prop() private loading!: boolean;
  @Prop() private disabled!: boolean;
  @Prop() private plain!: boolean;
  @Prop() private autofocus!: boolean;
  @Prop() private round!: boolean;
  @Prop() private circle!: boolean;

  @Inject({ default: null }) readonly elForm!: any;
  @Inject({ default: null }) readonly elFormItem!: any;

  private _elFormItemSize() {
    return (this.elFormItem || {}).elFormItemSize;
  }

  get buttonSize() {
    return (
      this.size || this._elFormItemSize || ((this as any).$albatro || {}).size
    );
  }

  get buttonDisabled() {
    return this.disabled || (this.elForm || {}).disabled;
  }

  handleClick(e: any) {
    this.$emit("click", e);
  }
}
</script>
