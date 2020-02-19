<template>
    <v-container>
        <v-card outlined>
            <v-toolbar flat :disabled="loading">
                <v-toolbar-title>
                    승인 대기 유저
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
                    color="gray"
                    class="ml-2"
                >
                    가입 거절
                </v-btn>
                <v-btn
                    @click="acceptUsers()"
                    :disabled="selected.length == 0"
                    outlined
                    color="green"
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
            >
                <template v-slot:no-data>
                    <p>승인 대기중인 유저가 없습니다.</p>
                </template>
            </v-data-table>
        </v-card>
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

            for (let user of this.selected) {
                await axios.post(`preuser/${user.username}`)
            }

            this.selected = []

            await this.fetchPreusers()
        },
        async denyUsers() {
            this.loading = true

            for (let user of this.selected) {
                await axios.delete(`preuser/${user.username}`)
            }

            this.selected = []

            await this.fetchPreusers()
        },
    },
    async created() {
        await this.fetchPreusers()
    },
}
</script>
