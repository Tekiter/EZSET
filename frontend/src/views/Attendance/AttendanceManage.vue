<template>
    <v-container class="fill-height">
        <v-row class="fill-height">
            <v-col cols="6" class="fill-height">
                <v-card class="fill-height">
                    <v-card-title>
                        출석 설정
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col cols="6" class="fill-height">
                <v-card class="fill-height" :loading="attable.isLoading">
                    <v-toolbar flat>
                        <v-toolbar-title>
                            출석 대상 유저
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-fade-transition>
                            <v-toolbar-title
                                v-show="attable.selections.length > 0"
                            >
                                <v-subheader
                                    >{{ attable.selections.length }}명
                                    선택됨</v-subheader
                                >
                            </v-toolbar-title>
                        </v-fade-transition>
                        <v-fade-transition>
                            <v-btn
                                icon
                                @click="removeAttableUsers"
                                v-show="attable.selections.length > 0"
                            >
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-fade-transition>
                        <v-btn icon @click="showAttAddDialog()">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-list>
                        <!-- <v-subheader>소속 유저</v-subheader> -->
                        <v-list-item>
                            <v-text-field
                                v-model="attable.search"
                                clearable
                                solo
                                outlined
                                flat
                                hide-details
                                dense
                                label="검색"
                                prepend-inner-icon="mdi-magnify"
                            ></v-text-field>
                        </v-list-item>

                        <template v-if="attable.isLoading">
                            <v-skeleton-loader
                                v-for="i in 7"
                                :key="`role-loading-${i}`"
                                type="list-item"
                            ></v-skeleton-loader>
                        </template>
                        <v-list-item-group
                            v-else
                            multiple
                            v-model="attable.selections"
                        >
                            <v-list-item
                                v-for="user in attable.users"
                                :key="user.username"
                                v-show="
                                    searchMatches(user.username, attable.search)
                                "
                            >
                                <template v-slot:default="{ active, toggle }">
                                    <v-list-item-action>
                                        <v-checkbox
                                            :input-value="active"
                                            :true-value="user"
                                            @click="toggle"
                                        ></v-checkbox>
                                    </v-list-item-action>

                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ user.username }}
                                            <span
                                                class="caption font-weight-light ml-3"
                                            >
                                                {{ user.realname }}
                                            </span>
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>

        <!-- 유저 추가 Dialog -->
        <v-dialog
            v-model="attAddDialog.show"
            :fullscreen="isMobileMode"
            max-width="800px"
            height="500px"
        >
            <v-card :loading="attAddDialog.isLoading">
                <v-card-title v-if="!isMobileMode"
                    >출석 대상 유저
                </v-card-title>
                <v-toolbar v-else flat>
                    <v-btn icon @click="closeAttAddDialog()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>유저 추가</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        @click.native="applyAttAddDialog()"
                        color="primary"
                        >추가</v-btn
                    >
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="attAddDialog.search"
                            clearable
                            solo
                            outlined
                            flat
                            hide-details
                            dense
                            label="검색"
                            prepend-inner-icon="mdi-magnify"
                        ></v-text-field>
                        <v-row no-gutters>
                            <v-col
                                v-for="user in attable.excludedUsers"
                                :key="user.username"
                                v-show="
                                    searchMatches(
                                        user.username,
                                        attAddDialog.search
                                    )
                                "
                                cols="12"
                                lg="3"
                                md="3"
                                sm="6"
                            >
                                <v-checkbox
                                    :label="`${user.username}`"
                                    v-model="attAddDialog.selections"
                                    :value="user.username"
                                    hide-details
                                ></v-checkbox>
                            </v-col>
                            <v-col
                                cols="12"
                                class="text-center mt-5"
                                v-if="attable.users.length == 0"
                            >
                                <p>추가 할 유저가 없습니다.</p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions v-if="!isMobileMode">
                    <v-spacer></v-spacer>
                    <v-fade-transition>
                        <small
                            v-show="attAddDialog.message"
                            class="red--text text--darken-4 mr-3"
                            >{{ attAddDialog.message }}</small
                        >
                    </v-fade-transition>

                    <v-btn
                        @click.native="applyAttAddDialog()"
                        text
                        color="primary"
                        >추가</v-btn
                    >
                    <v-btn @click.native="closeAttAddDialog()" text>취소</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<style scoped>
.fill-screen {
    min-height: 95%;
}
</style>
<script>
import axios from 'axios'
export default {
    data: () => ({
        allUsers: [],
        attable: {
            users: [],
            excludedUsers: [],
            search: '',
            selections: [],
            isLoading: false,
        },
        attAddDialog: {
            show: false,
            search: '',
            isLoading: false,
            selections: [],
            message: '',
        },
    }),
    computed: {
        isMobileMode() {
            return this.$vuetify.breakpoint.smAndDown
        },
        filteredAttUsers() {
            return this.attable.users.filter(user => {})
        },
    },
    methods: {
        async fetchAttableUsers() {
            this.attable.isLoading = true
            this.attable.selections = []

            const res = await axios.get('attendance/manage/user')
            this.attable.users = res.data.attableUsers
            this.attable.excludedUsers = res.data.excludedUsers

            this.attable.isLoading = false
        },
        async showAttAddDialog() {
            this.attAddDialog.show = true
            this.attAddDialog.selections = []
        },
        async closeAttAddDialog() {
            this.attAddDialog.show = false
        },
        async applyAttAddDialog() {
            try {
                this.attAddDialog.isLoading = true

                await axios.put('attendance/manage/user', {
                    users: this.attAddDialog.selections,
                })

                this.attAddDialog.show = false
                await this.fetchAttableUsers()
            } catch (_) {
                this.attAddDialog.message = '유저 추가에 실패했습니다.'
            } finally {
                this.attAddDialog.isLoading = false
            }
        },

        async removeAttableUsers() {
            const res = await this.$action.showConfirmDialog(
                '출석 대상 유저 제거',
                '정말 선택한 유저들을 출석 대상에서 제거하시겠습니까?'
            )
            if (res) {
                this.attable.isLoading = true
                for (let idx of this.attable.selections) {
                    await axios.delete(
                        `attendance/manage/user/${this.attable.users[idx].username}`
                    )
                }

                await this.fetchAttableUsers()
            }
        },

        searchMatches(haystack, niddle) {
            return haystack.includes(niddle || '')
        },
    },
    async created() {
        if (!this.$perm('manageRoles').can('access')) {
            this.$router.push({ name: 'error403' })
            return
        }
        await this.fetchAttableUsers()
    },
}
</script>
