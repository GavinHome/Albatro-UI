import AlButton from "~/button"
import AlSuperForm from "~/super-form"

const components: any = [
    AlButton,
    AlSuperForm
]

const componentsName: string[] = [
    "AlButton",
    "AlSuperForm"
]

const installConfig = {
    installed: false
}

const install = function (Vue: any, opts: any) {
    // 判断是否安装，安装过就不继续往下执行
    if (installConfig.installed) return
    installConfig.installed = true

    components.map((component: any, i: number) => {
        Vue.component(componentsName[i], component)
    })
}

export default {
    install,
    ...components
}