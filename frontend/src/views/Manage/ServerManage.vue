<template>
    <div>
        <v-banner v-model="settingChanged" single-line sticky tile>
            변경된 설정이 있습니다.

            <template v-slot:actions>
                <v-btn text color="deep-purple accent-4" @click="resetChanges()"
                    >되돌리기</v-btn
                >
                <v-btn text color="deep-purple accent-4" @click="saveChanges()"
                    >변경사항 저장</v-btn
                >
            </template>
        </v-banner>
        <v-row no-gutters justify="center" class="mt-4">
            <v-col cols="12" md="7">
                <v-card outlined :loading="isLoading">
                    <v-card-title>서버 설정</v-card-title>
                    <setting-select
                        v-model="settingData"
                        :items="settingItems"
                        @change="settingChanged = true"
                    ></setting-select>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios'
import SettingSelect from '../../components/manage/SettingSelect.vue'

export default {
    components: { SettingSelect },

    data: () => ({
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
            // for (let key of Object.keys(this.settingData)) {
            //     try {
            //         await axios.post(`config/option/${key}`, {
            //             value: this.settingData[key],
            //         })
            //     } catch (__) {
            //         //
            //     }
            // }
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
                type: 'header',
                title: '일반',
            },
            {
                type: 'text',
                title: '그룹 이름',
                content: '유저들에게 노출되는 그룹 이름입니다.',
                key: 'groupName',
            },
        ],
    },
}
</script>
