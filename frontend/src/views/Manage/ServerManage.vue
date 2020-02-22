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
                    <v-tabs-items v-model="curTab">
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
        resetChanges() {
            this.settingChanged = false
            this.settingData = this.originalSettings
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
        settingItems: () => [
            {
                type: 'text',
                title: '그룹 이름',
                content: '유저들에게 노출되는 그룹 이름입니다.',
                key: 'groupName',
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
        ],
    },
}
</script>
