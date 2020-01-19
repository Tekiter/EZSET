<template>
    <div class="ma-3 fill-height">
        <!-- <v-toolbar class="mb-1" flat></v-toolbar> -->
        <!-- <v-navigation-drawer permanent>
            
        </v-navigation-drawer> -->
        <v-row class="fill-height">
            <v-col cols="3">
                <v-card tile minHeight="95%">
                    <v-list>
                        <v-subheader>역할</v-subheader>
                        <template v-if="isLoading">
                            <v-skeleton-loader
                                v-for="i in 7"
                                :key="`role-loading-${i}`"
                                type="list-item"
                            ></v-skeleton-loader>
                        </template>
                        <v-list-item-group v-else :mandatory="true">
                            <v-list-item
                                v-for="role in roles"
                                :key="role.tag"
                                @click="switchRole(role)"
                            >
                                <v-list-item-content
                                    ><v-list-item-title>{{
                                        role.name
                                    }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
            <v-col>
                <v-card tile minHeight="95%">
                    <v-card-text>
                        <v-text-field
                            v-model="curRole.name"
                            label="이름"
                            placeholder="역할 이름"
                            outlined
                        ></v-text-field>
                        <v-divider></v-divider>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card :loading="curUsers.isLoading" tile minHeight="95%">
                    <v-toolbar flat>
                        <v-toolbar-title>
                            소속 유저
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-fade-transition>
                            <v-toolbar-title
                                v-show="curUsers.selections.length > 0"
                            >
                                <v-subheader
                                    >{{ curUsers.selections.length }}명
                                    선택됨</v-subheader
                                >
                            </v-toolbar-title>
                        </v-fade-transition>
                        <v-fade-transition>
                            <v-btn
                                icon
                                @click="showUserRemoveDialog"
                                v-show="curUsers.selections.length > 0"
                            >
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-fade-transition>
                        <v-btn icon @click="showUserAddDialog(curRole)">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-list>
                        <!-- <v-subheader>소속 유저</v-subheader> -->
                        <v-list-item>
                            <v-text-field
                                v-model="curUsers.search"
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

                        <template v-if="curUsers.isLoading">
                            <v-skeleton-loader
                                v-for="i in 7"
                                :key="`role-loading-${i}`"
                                type="list-item"
                            ></v-skeleton-loader>
                        </template>
                        <v-list-item-group
                            v-else
                            multiple
                            v-model="curUsers.selections"
                        >
                            <v-list-item
                                v-for="user in curUsers.users"
                                :key="user.username"
                                v-show="
                                    searchMatches(
                                        user.username,
                                        curUsers.search
                                    )
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
            v-model="userAddDialog.show"
            :fullscreen="$vuetify.breakpoint.smAndDown"
            max-width="800px"
            height="500px"
        >
            <v-card :loading="userAddDialog.isLoading">
                <v-card-title
                    >유저 추가
                    <v-card-subtitle>{{ curRole.name }}</v-card-subtitle>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="userAddDialog.search"
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
                                v-for="user in filteredUsers"
                                :key="user.username"
                                v-show="
                                    searchMatches(
                                        user.username,
                                        userAddDialog.search
                                    )
                                "
                                cols="12"
                                lg="3"
                                md="3"
                                sm="6"
                            >
                                <v-checkbox
                                    :label="`${user.username}`"
                                    v-model="userAddDialog.selections"
                                    :value="user.username"
                                    hide-details
                                ></v-checkbox>
                            </v-col>
                            <v-col
                                cols="12"
                                class="text-center mt-5"
                                v-if="filteredUsers.length == 0"
                            >
                                <p>추가 할 유저가 없습니다.</p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-fade-transition>
                        <small
                            v-show="userAddDialog.message"
                            class="red--text text--darken-4 mr-3"
                            >{{ userAddDialog.message }}</small
                        >
                    </v-fade-transition>

                    <v-btn
                        @click.native="applyUserAddDialog()"
                        text
                        color="primary"
                        >추가</v-btn
                    >
                    <v-btn @click.native="closeUserAddDialog()" text
                        >취소</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 유저 삭제 Dialog -->
        <v-dialog v-model="userRemoveDialog.show" max-width="400px">
            <v-card :loading="userRemoveDialog.isLoading">
                <v-card-title>유저 제거</v-card-title>

                <v-card-text>
                    <p>
                        {{ curRole.name }} 역할의 해당 유저들을
                        제거하시겠습니까?
                    </p>
                    <v-list dense>
                        <v-list-item
                            v-for="user in userRemoveDialog.users"
                            :key="user.username"
                        >
                            {{ user.username }}
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click.native="applyUserRemoveDialog()"
                        text
                        color="primary"
                        >확인</v-btn
                    >
                    <v-btn @click.native="userRemoveDialog.show = false" text
                        >취소</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<style scoped>
.fullheight {
    height: 100vh;
}
</style>
<script>
import axios from 'axios'

export default {
    data() {
        return {
            roles: [],
            fetchingCount: 0,
            users: [],
            curRole: {
                tag: '',
                name: '',
            },
            curUsers: {
                users: [],
                isLoading: false,
                search: '',
                selections: [],
                isActionOpen: false,
            },
            userAddDialog: {
                show: false,
                role: {},
                search: '',
                isLoading: false,
                selections: [],
                message: '',
            },
            userRemoveDialog: {
                show: false,
                isLoading: false,
                users: [],
            },
        }
    },
    computed: {
        isLoading() {
            return this.fetchingCount > 0
        },
        filteredUsers() {
            const userSet = new Set()
            this.curUsers.users.forEach(user => {
                userSet.add(user.username)
            })
            return this.users.filter(user => {
                return !userSet.has(user.username)
            })
        },
    },
    methods: {
        async fetchRoles() {
            this.fetchingCount += 1
            try {
                const roles = await axios.get('role')

                this.roles = roles.data
            } finally {
                this.fetchingCount -= 1
            }
        },
        async fetchRoleUsers() {
            this.curUsers.isLoading = true
            this.curUsers.users = await this.getRoleUsers(this.curRole)
            this.curUsers.isLoading = false
        },
        async fetchAllUsers() {
            this.userAddDialog.isLoading = true
            const res = await axios.get('user')
            this.users = res.data.users
            this.userAddDialog.isLoading = false
        },
        async getRoleUsers(role) {
            const res = await axios.get(`role/${role.tag}/users`)
            return res.data.users
        },
        async switchRole(role) {
            this.curRole.tag = role.tag
            this.curRole.name = role.name
            await this.fetchRoleUsers()
        },
        searchMatches(haystack, niddle) {
            return haystack.includes(niddle || '')
        },
        showUserAddDialog(role) {
            this.userAddDialog.show = true
        },
        closeUserAddDialog() {
            this.userAddDialog.show = false
        },
        async applyUserAddDialog() {
            try {
                this.userAddDialog.isLoading = true
                const tasks = this.userAddDialog.selections.map(
                    async username => {
                        try {
                            await axios.post(`user/${username}/role`, {
                                roletag: this.curRole.tag,
                            })
                            return true
                        } catch (_) {
                            return false
                        }
                    }
                )
                await Promise.all(tasks)
                this.userAddDialog.show = false
                await this.fetchRoleUsers()
            } catch (_) {
                this.userAddDialog.message = '유저 추가에 실패했습니다.'
            } finally {
                this.userAddDialog.isLoading = false
            }
        },
        showUserRemoveDialog() {
            this.userRemoveDialog.users = this.curUsers.selections.map(i => {
                return this.curUsers.users[i]
            })
            this.userRemoveDialog.show = true
        },
        async applyUserRemoveDialog() {
            this.userRemoveDialog.isLoading = true
            const tasks = this.userRemoveDialog.users.map(async user => {
                try {
                    await axios.delete(
                        `user/${user.username}/role/${this.curRole.tag}`
                    )
                    return true
                } catch (error) {
                    return false
                }
            })
            await Promise.all(tasks)
            this.userRemoveDialog.isLoading = false
            this.userRemoveDialog.show = false

            this.curUsers.selections = []

            await this.fetchRoleUsers()
        },
    },
    async created() {
        if (!this.$perm('manageUsers').can('access')) {
            this.$router.push({ name: 'error403' })
            return
        }
        this.fetchingCount += 1
        await this.fetchRoles()
        this.fetchingCount -= 1

        await this.switchRole(this.roles[0])
        await this.fetchAllUsers()
    },
    // async mounted() {
    // },
}
</script>
