import { color as d3Color } from 'd3-color'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'

const black = { r: 0, g: 0, b: 0 }
const white = { r: 255, g: 255, b: 255 }

export function contrastRatio(clearer, darker) {
    const clearerRl = relativeLuminance(clearer.r, clearer.g, clearer.b)
    const darkerRl = relativeLuminance(darker.r, darker.g, darker.b)

    return (clearerRl + 0.05) / (darkerRl + 0.05)
}

export function isDark(backgroundColor) {
    const color = d3Color(backgroundColor)
    const crFromWhite = contrastRatio(white, color)
    const crToBlack = contrastRatio(color, black)

    if (crFromWhite > crToBlack) {
        return true
    } else {
        return false
    }
}

export function isLight(backgroundColor) {
    return !isDark(backgroundColor)
}

function relativeLuminance(r8bit, g8bit, b8bit) {
    let rgb = [r8bit, g8bit, b8bit]

    rgb = flow(
        map(c => c / 255),
        map(c => {
            if (c <= 0.03928) {
                return c / 12.92
            } else {
                return ((c + 0.055) / 1.055) ** 2.4
            }
        })
    )(rgb)

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}
