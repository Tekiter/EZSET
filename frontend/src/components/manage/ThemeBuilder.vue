<template>
    <v-row>
        <v-col cols="12" md="6">
            <v-list subheader>
                <v-subheader>색상</v-subheader>
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
        <v-col cols="12" md="6" class="d-flex justify-center">
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
                    name: 'Primary',
                    key: 'primary',
                    content: '전체적으로 적용되는 메인 색상입니다.',
                },
                {
                    name: 'Secondary',
                    key: 'secondary',
                    content: '서브 색상입니다.',
                },
                {
                    name: 'Appbar',
                    key: 'theme-appbar',
                    content: '화면 위쪽 상단바 색상입니다.',
                },
                {
                    name: 'Success',
                    key: 'success',
                    content: '',
                },
                {
                    name: 'Warning',
                    key: 'warning',
                    content: '',
                },
                {
                    name: 'Error',
                    key: 'error',
                    content: '',
                },
                {
                    name: 'Info',
                    key: 'info',
                    content: '',
                },
            ]
        },
    },
}
</script>
