<template>
    <div class="">
        <!-- <h2 class="display-1">유저</h2> -->
        <v-data-iterator
            :items="users"
            :search="toolbar.search"
            :loading="true"
        >
            <template v-slot:header>
                <v-toolbar class="mb-1" flat>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="toolbar.search"
                        clearable
                        solo
                        outlined
                        flat
                        hide-details
                        dense
                        label="검색하기"
                        prepend-inner-icon="mdi-magnify"
                    ></v-text-field>
                </v-toolbar>
            </template>
            <template v-slot:loading>
                <!-- <div class="text-center py-10">
                    <v-progress-circular
                        indeterminate
                        color="purple"
                    ></v-progress-circular>
                </div> -->
                <v-row class="mx-2">
                    <v-col v-for="i in 6" :key="i" cols="12" md="6"
                        ><v-skeleton-loader
                            type="article"
                            class="mx-auto"
                        ></v-skeleton-loader
                    ></v-col>
                </v-row>
            </template>
            <template v-slot:default="props">
                <v-row class="mx-2">
                    <v-col
                        v-for="user in props.items"
                        :key="user.username"
                        cols="12"
                        md="6"
                    >
                        <v-card outlined>
                            <v-card-title>
                                <p class="subheader">
                                    {{ user.username }}
                                </p>
                                <p class="caption ml-2">{{ user.realname }}</p>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <div class="d-flex">
                                    <div class="d-flex flex-wrap flex-grow-1">
                                        <v-chip
                                            v-for="userrole in user.roles"
                                            :key="userrole"
                                            class="mr-2"
                                            outlined
                                        >
                                            {{ roles[userrole].name }}
                                        </v-chip>
                                        <v-btn
                                            v-if="$perm('role').can('modify')"
                                            @click="showRoleDialog(user)"
                                            icon
                                            small
                                        >
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </div>
                                    <div class="d-flex pl-3">
                                        <v-btn
                                            @click="showEditDialog(user)"
                                            icon
                                        >
                                            <v-icon
                                                >mdi-account-edit-outline</v-icon
                                            >
                                        </v-btn>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>

        <!-- 유저 Action Dialog -->
        <v-dialog v-model="editDialog.show" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">유저 관리</span
                    ><v-card-subtitle>{{
                        editDialog.user.username
                    }}</v-card-subtitle>
                </v-card-title>
                <v-card-text>
                    <v-divider />
                    <v-list subheader>
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title>회원탈퇴</v-list-item-title>
                                <v-list-item-subtitle>
                                    유저가 작성했던 게시글 등은 삭제되지
                                    않습니다.
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn
                                    @click="
                                        deleteUser(editDialog.user.username)
                                    "
                                    color="error"
                                    depressed
                                    >회원탈퇴</v-btn
                                >
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                    <v-divider />
                    <!-- <v-container>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-btn color="error" depressed>회원탈퇴</v-btn>
                            </v-col>
                        </v-row>
                    </v-container> -->
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="editDialog.show = false" text
                        >닫기</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 유저 역할 변경 Dialog -->
        <v-dialog v-model="roleDialog.show" persistent max-width="300px">
            <v-card :loading="roleDialog.isLoading">
                <v-card-title>
                    <span class="headline">역할 변경</span>
                    <v-card-subtitle>{{
                        roleDialog.user.username
                    }}</v-card-subtitle>
                </v-card-title>

                <v-card-text>
                    <v-text-field
                        v-model="roleDialog.search"
                        clearable
                        solo
                        outlined
                        flat
                        hide-details
                        dense
                        label="검색"
                        prepend-inner-icon="mdi-magnify"
                    ></v-text-field>

                    <v-list>
                        <v-list-item-group
                            multiple
                            v-model="roleDialog.selections"
                        >
                            <v-list-item
                                v-for="role in assignableRoles"
                                :key="role.tag"
                                v-show="
                                    searchMatches(role.name, roleDialog.search)
                                "
                            >
                                <template v-slot:default="{ active, toggle }">
                                    <v-list-item-action>
                                        <v-checkbox
                                            :input-value="active"
                                            :true-value="role"
                                            color="grey"
                                            @click="toggle"
                                        ></v-checkbox>
                                    </v-list-item-action>

                                    <v-list-item-content>
                                        <v-list-item-title
                                            v-text="role.name"
                                        ></v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    <small class="red--text text--darken-4">{{
                        roleDialog.errorMessage
                    }}</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="applyRoleDialog" text color="primary"
                        >변경</v-btn
                    >
                    <v-btn @click.native="closeRoleDialog()" text>취소</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    data() {
        return {
            users: [],
            rawRoles: [], // 배열로 된 role 목록
            fetchingCount: 0,
            totalCount: 0,
            toolbar: {
                search: '',
            },
            editDialog: {
                show: false,
                user: {},
            },
            roleDialog: {
                show: false,
                user: {},
                search: '',
                selections: [],
                isLoading: false,
                errorMessage: '',
            },
        }
    },
    computed: {
        isFetching() {
            return this.fetchingCount > 0
        },
        roles() {
            // Object 형태로 가공된 role 목록
            const newrole = {}
            this.rawRoles.forEach(role => {
                newrole[role.tag] = role
            })
            return newrole
        },
        assignableRoles() {
            return this.rawRoles.filter(role => role.tag != 'default')
        },
    },
    methods: {
        async fetchUsers() {
            this.fetchingCount += 1
            try {
                const users = await axios.get('user')

                this.totalCount = users.data.total
                this.users = users.data.users
            } finally {
                this.fetchingCount -= 1
            }
        },
        async fetchRoles() {
            this.fetchingCount += 1
            try {
                const roles = await axios.get('role')

                this.rawRoles = roles.data
            } finally {
                this.fetchingCount -= 1
            }
        },
        searchMatches(haystack, niddle) {
            return haystack.includes(niddle)
        },
        showEditDialog(user) {
            this.editDialog.user = user
            this.editDialog.show = true
        },
        showRoleDialog(user) {
            this.roleDialog.show = true
            this.roleDialog.user = user
            const selections = []
            for (let i in this.rawRoles) {
                if (user.roles.indexOf(this.rawRoles[i].tag) >= 0) {
                    selections.push(parseInt(i))
                }
            }
            this.roleDialog.selections = selections
        },
        async applyRoleDialog() {
            const newroles = this.roleDialog.selections.map(i => {
                return this.rawRoles[i].tag
            })
            this.roleDialog.isLoading = true
            try {
                await axios.put(`user/${this.roleDialog.user.username}/role`, {
                    roletags: newroles,
                })
                this.roleDialog.user.roles = newroles
                this.closeRoleDialog()
            } catch (error) {
                this.roleDialog.errorMessage = error.response.data.message
            } finally {
                this.roleDialog.isLoading = false
            }
        },
        closeRoleDialog() {
            this.roleDialog.selections = []
            this.roleDialog.errorMessage = ''
            this.roleDialog.show = false
        },
        async deleteUser(username) {
            const reply = await this.$action.showConfirmDialog(
                '회원 탈퇴',
                `정말 ${username} 유저를 탈퇴시키겠습니까?`
            )
            if (reply) {
                try {
                    await axios.delete(`user/${username}`)
                    this.editDialog.show = false
                    await Promise.all([
                        this.$action.showAlertDialog(
                            '회원 탈퇴',
                            `${username} 유저가 탈퇴 처리되었습니다.`
                        ),
                        this.fetchUsers(),
                    ])
                } catch (err) {
                    //
                    await this.$action.showAlertDialog(
                        '오류',
                        '탈퇴에 실패했습니다.'
                    )
                }
            }
        },
    },
    async created() {
        if (!this.$perm('manageUsers').can('access')) {
            this.$router.push({ name: 'error403' })
            return
        }

        this.fetchingCount += 1
        await this.fetchRoles()
        await this.fetchUsers()
        this.fetchingCount -= 1
    },
}
</script>
