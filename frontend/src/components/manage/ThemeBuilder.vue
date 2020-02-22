<template>
    <v-row>
        <v-col>
            <v-list subheader>
                <v-subheader>옵션</v-subheader>
                <v-list-item-group v-model="selectedIndex" mandatory>
                    <v-list-item
                        v-for="option of options"
                        :key="`theme-builder-${option.key}`"
                        two-line
                        :color="theme.themes[targetTheme][option.key]"
                    >
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ option.name }}
                            </v-list-item-title>
                            <div class="subtitle-2 grey--text text--darken-1">
                                {{ option.content }}
                            </div>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-chip
                                :color="theme.themes[targetTheme][option.key]"
                            >
                            </v-chip>
                        </v-list-item-action>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-col>
        <v-col>
            <v-color-picker
                v-model="theme.themes[targetTheme][options[selectedIndex].key]"
                @update:color="valueChanged"
                mode="rgba"
                show-swatches
                swatches-max-height="300px"
            ></v-color-picker>
        </v-col>
    </v-row>
</template>
<script>
import _ from 'lodash'

export default {
    props: {
        value: {
            type: Object,
            default: () => ({}),
        },
    },
    data: () => ({
        theme: {},
        targetTheme: 'light',
        selectedIndex: 0,
        currentColor: '#ffffff',
    }),
    methods: {
        isChanged() {
            this.$emit('change')
        },
        fillTheme(theme) {
            ;['light', 'dark'].forEach(k => {
                if (!theme[k]) {
                    theme[k] = {}
                }
                this.options.forEach(option => {
                    if (!theme[k][option.key]) {
                        theme[k][option.key] = '#ffffff'
                    }
                })
            })

            return theme
        },
        valueChanged() {
            this.$emit('input', _.cloneDeep(this.theme))
            this.$emit('change')
        },
        async applyTheme() {},
    },
    created() {
        this.theme = _.cloneDeep(this.value)
        this.fillTheme(this.theme.themes)
    },
    watch: {
        value(newval, oldval) {
            this.theme = _.cloneDeep(this.value)
            this.fillTheme(this.theme.themes)
        },
    },
    computed: {
        options() {
            return [
                {
                    name: '메인 색상',
                    key: 'primary',
                    content: '주요 색상입니다.',
                },
                {
                    name: '서브 색상',
                    key: 'secondary',
                    content: '서브 색상입니다.',
                },
            ]
        },
    },
}
</script>
