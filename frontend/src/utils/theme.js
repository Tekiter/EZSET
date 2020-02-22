import Vuetify from '../plugins/vuetify'
import { isDark } from './color'

export function applyTheme(theme) {
    console.log(theme)
    //     try {
    const themes = theme.themes
    Object.keys(themes).forEach(i => {
        Vuetify.framework.theme.themes[i] = themes[i]
    })
    console.log(Vuetify.framework.theme)
    // } catch (error) {
    //     //
    // }
}

export const themeHelper = {
    install(Vue, options) {
        Vue.mixin({
            methods: {
                isDarkColor(colorText) {
                    const color =
                        Vuetify.framework.theme.themes.light[colorText]
                    if (!color) {
                        return false
                    }
                    return isDark(color)
                },
            },
        })
    },
}
