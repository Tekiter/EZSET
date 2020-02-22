import Vuetify from '../plugins/vuetify'
import { isDark } from './color'

/**
 * Vuetify 테마 객체를 넣으면 이를 실제로 반영시켜 준다.
 * @param {*} theme Vuetify 테마 객체
 */
export function applyTheme(theme) {
    try {
        const themes = theme.themes
        Object.keys(themes).forEach(i => {
            Vuetify.framework.theme.themes[i] = themes[i]
        })
    } catch (error) {
        //
    }
}

/**
 * 프로젝트 전체에서 색깔이 어두운 계열인지 판단할 수 있게 해주는 isDarkColor 메서드를 추가한다.
 */
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
