<template>
    <v-container>
        <v-card outlined>
            <v-toolbar flat :disabled="loading">
                <v-toolbar-title>
                    승인 대기 유저
                    <v-btn @click="fetchPreusers" fab icon :disabled="loading">
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="검색"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn
                    @click="denyUsers()"
                    :disabled="selected.length == 0"
                    outlined
                    color="warning darken-2"
                    class="ml-2"
                >
                    가입 거절
                </v-btn>
                <v-btn
                    @click="acceptUsers()"
                    :disabled="selected.length == 0"
                    outlined
                    color="success darken-2"
                    class="ml-2"
                >
                    가입 승인
                </v-btn>
            </v-toolbar>

            <v-data-table
                v-model="selected"
                :headers="headers"
                :items="users"
                :search="search"
                :loading="loading"
                show-select
                item-key="username"
                locale="ko-KR"
            >
                <template v-slot:no-data>
                    <p class="mt-3">승인 대기중인 유저가 없습니다.</p>
                </template>
                <template v-slot:loading>
                    <p class="mt-3">불러오는중..</p>
                </template>
            </v-data-table>
        </v-card>
        <v-snackbar v-model="snackbar.show" :timeout="2000">
            {{ snackbar.content }}

            <v-btn dark text @click="snackbar = false">
                닫기
            </v-btn>
        </v-snackbar>
    </v-container>
</template>
<script>
import axios from 'axios'
export default {
    data: () => ({
        headers: [
            {
                text: '아이디',
                value: 'username',
                align: 'left',
            },
            {
                text: '이름',
                value: 'realname',
            },
            {
                text: '이메일',
                value: 'email',
            },
        ],
        users: [],
        search: '',
        selected: [],
        loading: false,
        snackbar: {
            show: false,
            content: '',
        },
    }),
    methods: {
        async fetchPreusers() {
            this.loading = true

            const res = await axios.get('preuser')
            this.users = res.data.users

            this.loading = false
        },
        async acceptUsers() {
            this.loading = true
            try {
                for (let user of this.selected) {
                    await axios.post(`preuser/${user.username}`)
                }

                this.showSnack(
                    `${this.selected.length}명의 가입을 승인했습니다.`
                )

                this.selected = []

                await this.fetchPreusers()
            } catch (error) {
                this.showSnack('오류가 발생했습니다.')
            }

            this.loading = false
        },
        async denyUsers() {
            this.loading = true

            try {
                for (let user of this.selected) {
                    await axios.delete(`preuser/${user.username}`)
                }

                this.showSnack(
                    `${this.selected.length}명의 가입을 거절했습니다.`
                )

                this.selected = []

                await this.fetchPreusers()
            } catch (__) {
                this.showSnack('오류가 발생했습니다.')
            }
            this.loading = false
        },
        showSnack(content) {
            this.snackbar.content = content
            this.snackbar.show = true
        },
    },
    async created() {
        await this.fetchPreusers()
    },
}
</script>
