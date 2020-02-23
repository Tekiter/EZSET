<template>
    <div>
        <v-row no-gutters justify="center" class="mt-4">
            <v-col cols="12" md="7">
                <v-card outlined :loading="isLoading">
                    <v-toolbar flat>
                        <v-toolbar-title>
                            서버 설정
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-fade-transition>
                            <v-btn
                                text
                                color="primary accent-4"
                                @click="resetChanges()"
                                v-show="settingChanged"
                            >
                                되돌리기
                            </v-btn>
                        </v-fade-transition>
                        <v-fade-transition>
                            <v-btn
                                outlined
                                color="primary accent-4"
                                @click="saveChanges()"
                                v-show="settingChanged"
                            >
                                변경사항 저장
                            </v-btn>
                        </v-fade-transition>
                    </v-toolbar>

                    <v-tabs v-model="curTab">
                        <v-tab key="tab-general">일반</v-tab>
                        <v-tab key="tab-theme">테마</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="curTab" touchless>
                        <v-tab-item key="tab-general">
                            <setting-select
                                v-model="settingData"
                                :items="settingItems"
                                @change="settingChanged = true"
                            ></setting-select>
                        </v-tab-item>
                        <v-tab-item key="tab-theme">
                            <theme-manage
                                v-model="settingData.theme"
                                @change="settingChanged = true"
                            ></theme-manage>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios'
import SettingSelect from '../../components/manage/SettingSelect.vue'
import ThemeManage from '../../components/manage/ThemeBuilder.vue'

export default {
    components: { SettingSelect, ThemeManage },

    data: () => ({
        curTab: 0,
        isLoading: false,
        originalSettings: {},
        settingData: {},
        settingChanged: false,
    }),
    methods: {
        async fetchSettings() {
            this.isLoading = true

            const res = await axios.get('config/admin')
            this.originalSettings = res.data
            this.settingData = res.data
            this.settingChanged = false

            this.isLoading = false
        },
        async resetChanges() {
            await this.fetchSettings()
        },
        async saveChanges() {
            this.isLoading = true

            await axios.patch('config/admin', this.settingData)
            await this.$store.dispatch('config/fetchConfig')
            await this.fetchSettings()

            this.isLoading = false
        },
    },
    async created() {
        await this.fetchSettings()
    },
    computed: {
        settingItems() {
            return [
                {
                    type: 'text',
                    title: '그룹 이름',
                    content: '유저들에게 노출되는 그룹 이름입니다.',
                    key: 'groupName',
                },
                {
                    type: 'line',
                },
                {
                    type: 'header',
                    title: '가입',
                },
                {
                    type: 'switch',
                    title: '가입승인제',
                    content: '관리자의 승인이 있어야 회원가입이 완료됩니다.',
                    key: 'usePreUser',
                },
                {
                    type: 'action',
                    title: '서버 설정 초기화',
                    content: '서버 설정을 초기화합니다.',
                    caption: '초기화',
                    action: async () => {
                        const res = await this.$action.showConfirmDialog(
                            '서버 설정 초기화',
                            '정말 서버 설정을 초기화 하시겠습니까?. 서버 설정 외의 데이터는 변경되지 않습니다.'
                        )
                        if (res) {
                            await axios.post('config/reset')
                            await this.$action.showAlertDialog(
                                '서버 설정 초기화',
                                '서버 설정이 초기화 되었습니다.'
                            )
                            location.reload()
                        }
                    },
                },
            ]
        },
    },
    async beforeRouteLeave(to, from, next) {
        if (this.settingChanged) {
            const res = await this.$action.showConfirmDialog(
                '서버 설정',
                '저장하지 않은 설정이 있습니다. 정말 나가시겠습니까?'
            )
            if (res) {
                next()
            } else {
                next(false)
            }
        } else {
            next()
        }
    },
}
</script>
