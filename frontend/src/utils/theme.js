import Vuetify from '../plugins/vuetify'
import { isDark } from './color'

export function applyTheme(themes) {
    try {
        Object.keys(themes).forEach(i => {
            Vuetify.framework.theme.themes[i] = themes[i]
        })
    } catch (error) {
        //
    }
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
