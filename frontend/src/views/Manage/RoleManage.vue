<template>
    <div class="ma-3 fill-height">
        <!-- <v-toolbar class="mb-1" flat></v-toolbar> -->
        <!-- <v-navigation-drawer permanent>
            
        </v-navigation-drawer> -->

        <v-row :no-gutters="isMobileMode" class="fill-height">
            <v-col v-show="isMobileMode" cols="12">
                <v-tabs v-model="curTab" class="mt-3">
                    <v-tab>
                        역할
                    </v-tab>
                    <v-tab>
                        권한 설정
                    </v-tab>
                    <v-tab>
                        소속 유저
                    </v-tab>
                </v-tabs>
            </v-col>

            <!-- 역할 column  -->
            <v-col
                cols="12"
                md="3"
                v-show="!isMobileMode || curTab == 0"
                class="fill-screen"
            >
                <v-card tile minHeight="95%" :loading="isLoading" outlined>
                    <v-card-title>역할</v-card-title>
                    <v-list>
                        <!-- <v-subheader>역할</v-subheader> -->
                        <template v-if="isLoading && roles.length == 0">
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
                                @click="
                                    switchRole(role)
                                    curTab = 1
                                "
                            >
                                <v-list-item-content
                                    ><v-list-item-title>{{
                                        role.name
                                    }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                        <v-menu
                            v-if="$perm('role').can('modify')"
                            v-model="roleAddDialog.show"
                            :close-on-content-click="false"
                        >
                            <template v-slot:activator="{ on }">
                                <v-list-item link v-on="on">
                                    <v-list-item-icon>
                                        <v-icon>mdi-plus</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title class="grey--text">
                                        새 역할 추가
                                    </v-list-item-title>
                                </v-list-item>
                            </template>
                            <v-card :loading="roleAddDialog.isLoading" outlined>
                                <v-card-title class="pb-0">
                                    <v-text-field
                                        label="역할 이름"
                                        v-model="roleAddDialog.name"
                                        solo
                                        outlined
                                        flat
                                        hide-details
                                        dense
                                        class="ma-auto"
                                        :error-messages="roleAddDialog.message"
                                    >
                                    </v-text-field>
                                </v-card-title>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="applyRoleAddDialog"
                                        >역할 추가</v-btn
                                    >
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </v-list>
                </v-card>
            </v-col>

            <!-- 권한 설정 column -->
            <v-col
                cols="12"
                md="5"
                v-show="!isMobileMode || curTab == 1"
                class="fill-screen"
            >
                <role-perm-edit
                    :roletag="curRole.tag"
                    :disabled="!$perm('role').can('modify')"
                    @removed="roleRemoved()"
                    @change="fetchRoles()"
                ></role-perm-edit>
            </v-col>

            <!-- 소속 유저 column -->
            <v-col
                cols="12"
                md="4"
                v-show="!isMobileMode || curTab == 2"
                class="fill-height"
            >
                <v-card
                    :loading="curUsers.isLoading"
                    tile
                    minHeight="95%"
                    outlined
                >
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
            :fullscreen="isMobileMode"
            max-width="800px"
            height="500px"
        >
            <v-card :loading="userAddDialog.isLoading">
                <v-card-title v-if="!isMobileMode"
                    >유저 추가
                    <v-card-subtitle>{{ curRole.name }}</v-card-subtitle>
                </v-card-title>
                <v-toolbar v-else flat>
                    <v-btn icon @click="closeUserAddDialog()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>유저 추가</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        @click.native="applyUserAddDialog()"
                        color="primary"
                        >추가</v-btn
                    >
                </v-toolbar>
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
                <v-card-actions v-if="!isMobileMode">
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
.fill-screen {
    min-height: 95%;
}
</style>
<script>
import axios from 'axios'
import RolePermEdit from '../../components/manage/RolePermEdit.vue'

export default {
    components: {
        RolePermEdit,
    },
    data() {
        return {
            roles: [],
            fetchingCount: 0,
            users: [],
            curTab: 0,

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
            roleAddDialog: {
                show: false,
                name: '',
                isLoading: false,
                message: '',
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
        isMobileMode() {
            return this.$vuetify.breakpoint.smAndDown
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
            this.curUsers.selections = []
            this.userAddDialog.selections = []
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
        async applyRoleAddDialog() {
            try {
                if (!this.roleAddDialog.name) {
                    throw new Error()
                }
                this.roleAddDialog.isLoading = true
                await axios.post('role', {
                    name: this.roleAddDialog.name,
                })
                this.roleAddDialog.show = false
                this.roleAddDialog.name = ''
                this.roleAddDialog.isLoading = false
                await this.fetchRoles()
            } catch (error) {
                this.roleAddDialog.isLoading = false
                // this.roleAddDialog.message = '역할 추가에 실패했습니다.'
            }
        },
        async roleRemoved() {
            await this.fetchRoles()
            this.switchRole(this.roles[0])
            this.curTab = 0
        },
    },
    async created() {
        if (!this.$perm('role').can('modify')) {
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
