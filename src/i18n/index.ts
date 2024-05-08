import en from './en'
import cn from './cn'

const state = useGlobalState()
const message = { cn, en }

const i18n = createI18n({
    locale: state.value.language, // 设置语言类型
    legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
    globalInjection: true, // 全局注册$t方法
    messages: message,
})

export default i18n
