<template>
  <div class="al-super-form">
      <el-form label-position="top" :label-width="labelWidth + 'px'" :model="formData" ref="form" :rules="rules"
        @submit.native.prevent="handleValidateForm" @keydown.native.enter.prevent ="()=>{}">
        <!-- 默认插槽作为表单项 -->
        <slot />

        <div class="single-collapse" v-if="isGroupalbe">
            <el-row :gutter="24">
                <el-col :span="field.cols ? 8 * field.cols : 8" v-for="(field) of formDesc" :key="field.key">
                    <el-form-item :label="field.label ? field.label + '：' : ''" size="medium" :prop="field.name"
                        :class="field.type === 'text' ? 'readonly' : '' ">
                        <!-- 具名 作用域插槽(用于用户自定义显示) -->
                        <slot :data="formData[field.name]" :name="field.name">
                            <component :desc="field" :is="getComponentName(field.type)" v-model="formData[field.name]"
                                v-bind="field.attrs" :class="field.class" :style="field.style" v-on="field.on" />
                        </slot>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>

        <el-collapse :value="ActiveCollapses" v-else>
            <el-collapse-item v-for="(group) of form" :title="group.title" :name="group.name" :key="group.key">
                <el-row :gutter="24" v-for="(row) of group.rows" :key="row.key">
                    <el-col :span="field.cols ? 8 * field.cols : 8" v-for="(field) of row.fields"
                        :key="field.key">

                        <el-form-item :label="field.label ? field.label + '：' : ''" size="medium" :prop="field.name"
                            :class="field.type === 'text' ? 'readonly': '' ">
                            <!-- 具名 作用域插槽(用于用户自定义显示) -->
                            <slot :data="formData[field.name]" :name="field.name">
                                <component :desc="field" :is="getComponentName(field.type)" v-bind="field.attrs"
                                    v-model="formData[field.name]" :class="field.class" :style="field.style"
                                    v-on="field.on" />
                            </slot>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>
        <el-row class="mb15 mt15">
            <el-form-item class="text-right">
                <slot name="button-group"></slot>
                <el-button type="primary" :loading="isLoading || innerIsLoading" native-type="submit"
                    v-if="showSubmitBtn">{{submitBtnText?submitBtnText:'提交'}}</el-button>
                <el-button @click="goBack" v-if="showBackBtn">{{backBtnText?backBtnText:'返回'}}</el-button>
            </el-form-item>
        </el-row>
    </el-form>
  </div>
</template>
<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TzSuperFormGroup, TzSuperFormType, TzSuperFormField, getComponentName } from "./schema/TzSuperFormSchema";
import { TzFetch } from "./extension/TzFetch";

@Component({
    props: ["form", "formData", "rules", "isLoading", "formError", "requestFn", "isHideSubmitBtn", "isHideBackBtn", "submitBtnText", "backBtnText", "labelWidth", "single", "isCustomHandleRequest", "action", "isAutoHandlePost"],
    components: {
        TzSuperTextarea: require('./components/TzSuperTextarea.vue'),
        TzSuperNumber: require('./components/TzSuperNumber.vue'),
        TzSuperSelect: require('./components/TzSuperSelect.vue'),
        TzSuperDialog: require('./components/TzSuperDialog.vue'),
        TzSuperText: require('./components/TzSuperText.vue'),
        TzSuperSwitch: require('./components/TzSuperSwitch.vue'),
        TzSuperShell: require('./components/TzSuperShell.vue'),
        TzSuperTime: require('./components/TzSuperTime.vue'),
        TzSuperTag: require('./components/TzSuperTag.vue'),
        TzSuperRadio: require('./components/TzSuperRadio.vue'),
        TzSuperCheckbox: require('./components/TzSuperCheckbox.vue'),
        TzSuperDate: require('./components/TzSuperDate.vue'),
        TzSuperDatetime: require('./components/TzSuperDatetime.vue'),
        TzSuperRate: require('./components/TzSuperRate.vue'),
        TzSuperSlider: require('./components/TzSuperSlider.vue'),
        TzSuperPassword: require('./components/TzSuperPassword.vue'),
        TzSuperYear: require('./components/TzSuperYear.vue'),
        TzSuperMonth: require('./components/TzSuperMonth.vue'),
        TzSuperInput: require('./components/TzSuperInput.vue'),
        TzSuperDaterange: require('./components/TzSuperDateRange.vue'),
        TzSuperMonthrange: require('./components/TzSuperMonthRange.vue'),
        TzSuperDatetimerange: require('./components/TzSuperDateTimeRange.vue'),
        TzSuperDates: require('./components/TzSuperDates.vue'),
        TzSuperWeek: require('./components/TzSuperWeek.vue'),
        TzSuperTimerange: require('./components/TzSuperTimeRange.vue'),
        TzSuperButton: require('./components/TzSuperButton.vue'),
        TzSuperAutocomplete: require('./components/TzSuperAutocomplete.vue'),
        TzSuperGrid: require('./components/TzSuperGrid.vue')
    }
})
export default class AlSuperForm extends Vue{
    @Prop() form!: TzSuperFormGroup[]
    @Prop() formData!: any
    @Prop() rules!: any
    @Prop() isLoading!: boolean
    @Prop() formError!: any
    @Prop() requestFn!: Function
    @Prop({ default: false }) isHideSubmitBtn!: boolean  //是否隐藏submit按钮
    @Prop({ default: false }) isHideBackBtn!: boolean  //是否隐藏back按钮

    @Prop({ default: '提交' }) submitBtnText!: string  //提交按钮文本
    @Prop({ default: '返回' }) backBtnText!: string  //返回按钮文本

    @Prop({ default: 120 }) labelWidth!: Number  //标签宽度

    @Prop({ default: false }) single!: boolean

    @Prop({ default: false }) isCustomHandleRequest!: boolean
    @Prop({ default: true }) isAutoHandlePost!: boolean
    @Prop() action!: string

    // 是否正在请求中
    innerIsLoading: boolean = false;
    // 内部请求出错
    innerFormError: any = {};

    get ActiveCollapses() {
        return this.form.filter(x => !x.isCollapsed).map(x => x.name)
    }

    get isGroupalbe() {
        return this.single
    }

    get showSubmitBtn() {
        return !this.isHideSubmitBtn;
    }

    get showBackBtn() {
        return !this.isHideBackBtn;
    }

    get formDesc() {
        let fields: TzSuperFormField[] = [];
        this.form.forEach((f, i) => {
            f.rows.forEach((r, j) => {
                fields = fields.concat(r.fields)
            })
        })

        return fields;
    }

    getComponentName(type: TzSuperFormType) {
        return getComponentName(type)
    }

    handleValidateForm(e:any) {
        if (this.rules) {
            (this.$refs['form'] as any).validate((valid:boolean, invalidFields:any) => {
                if (valid) {
                    this.handleSubmitForm()
                } else {
                    return this.processValidError(invalidFields)
                }
            })
        } else {
            this.handleSubmitForm()
        }
    }

    // 提交表单
    async handleSubmitForm() {
        //const data = cloneDeep(this.formData)
        const data = this.formData
        for (const field in data) {
            if (this.formDesc[field as any] && this.formDesc[field as any].valueFormatter) {
                data[field] = this.formDesc[field as any].valueFormatter(data[field])
            }
        }

        if (this.requestFn && !this.isCustomHandleRequest) {
            // 在内部请求
            if (this.innerIsLoading) return
            this.innerIsLoading = true
            try {
                ////设置了自动提交，并存在提交地址，则自动提交请求
                let res: any = data
                if (this.isAutoHandlePost && this.action) {
                    res = await TzFetch.Post(this.action, this.formData)
                }

                ////转交数据到外部函数
                const response = await this.requestFn(res)
                this.$nextTick(() => {
                    ////处理成功
                    this.$emit('request-success', response)
                })
            } catch (error) {
                // 处理异常情况
                if (error instanceof Error) {
                    // 返回的是Error类型, 则进行解析
                    try {
                        const msg = JSON.parse(error.message)
                        if (msg instanceof Object) {
                            this.innerFormError = msg
                        }
                        // eslint-disable-next-line
                    } catch {
                        this.innerFormError = error
                    }
                } else if (error instanceof Object) {
                    // 返回的是对象类型, 则直接设置
                    this.innerFormError = error
                }

                this.$emit('request-error', this.innerFormError)
            } finally {
                this.innerIsLoading = false
                this.$nextTick(() => {
                    this.$emit('request-end')
                })
            }
        } else {
            // 在外部请求
            if (this.isLoading) return
            this.$emit('request', data)
        }
    }

    // 处理表单错误
    processValidError(invalidFields: any) {
        return false;
    }

    goBack() {
        if (this.$router) {
            // vue-router
            this.$router.back()
        } else {
            // 浏览器history API
            history.back()
        }
    }
}
</script>
