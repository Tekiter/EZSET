<template>
    <v-card outlined :loading="loading">
        <v-toolbar flat>
            <v-toolbar-title>
                <span v-show="$vuetify.breakpoint.mdAndUp">게시판</span>
                권한
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-fade-transition>
                <v-btn
                    text
                    color="primary accent-4"
                    @click="resetChanges()"
                    v-show="settingChanged"
                    :disabled="loading"
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
                    :disabled="loading"
                >
                    변경사항 저장
                </v-btn>
            </v-fade-transition>
        </v-toolbar>
        <v-list subheader v-show="!loading">
            <board-perm-edit
                v-model="board.roles"
                v-for="board in boards"
                :key="`board-${board._id}`"
                :roles="roles"
                :board="board"
                :actions="actions"
                :disabled="loading"
                @change="settingChanged = true"
                class="mb-2 mx-1"
            ></board-perm-edit>
        </v-list>
    </v-card>
</template>

<script>
import axios from 'axios'
// import { Role } from '../../utils/role/libs/Role'
import Permission from '../../utils/role/libs/Permission'
import BoardPermEdit from './BoardPermEdit.vue'

export default {
    components: {
        BoardPermEdit,
    },
    data: () => ({
        boards: [],
        roles: [],
        roleChecker: {},
        loading: false,
        settingChanged: false,
        actions: [
            {
                name: '글 보기',
                key: 'read',
            },
            {
                name: '글 작성',
                key: 'write',
            },
            {
                name: '다른 유저의 글과 댓글 삭제',
                key: 'delete',
            },
        ],
    }),
    methods: {
        async fetchBoards() {
            this.loading = true
            const res = await axios.get('simple/boards')
            this.boards = res.data.map(board => ({
                ...board,
                roles: [],
            }))
            this.loading = false
        },
        async fetchRoles() {
            this.loading = true
            this.roles = []
            const res = await axios.get('role')
            const roleNames = res.data
            for (let role of roleNames) {
                if (role.tag === 'admin') {
                    continue
                }
                const res = await axios.get(`role/${role.tag}`)
                this.roles.push({
                    name: role.name,
                    tag: role.tag,
                    perm: res.data.perm,
                })
                // this.roleChecker[role.tag] = new Role({
                //     perm: res.data.perm,
                // }).createPermChecker()

                this.roleChecker[role.tag] = (resource, param) => {
                    return new Permission(res.data.perm[resource], param + '')
                }
                // console.log(this.roleChecker)
            }

            this.loading = false
        },
        async setInitBoardPerms() {
            for (let board of this.boards) {
                const newroles = []
                // console.log(this.roleChecker)
                for (let action of this.actions) {
                    const selectedRoles = this.roles
                        .filter(role =>
                            this.roleChecker[role.tag](
                                'board',
                                board._id + ''
                            ).can(action.key)
                        )
                        .map(role => {
                            return role.tag
                        })
                    newroles.push({
                        action: action.key,
                        roles: selectedRoles,
                    })
                }

                board.roles = newroles
            }
        },
        async resetChanges() {
            await this.fetchRoles()
            await this.fetchBoards()
            await this.setInitBoardPerms()
            this.settingChanged = false
        },
        async saveChanges() {
            // const perms = []
            this.loading = true
            const roles = {}
            for (let board of this.boards) {
                for (let action of board.roles) {
                    for (let role of this.roles) {
                        if (!roles[role.tag]) {
                            roles[role.tag] = []
                        }

                        const grant = {
                            resource: 'board',
                            param: board._id + '',
                            action: action.action,
                            range: 'any',
                        }

                        if (
                            Array.isArray(action.roles) &&
                            action.roles.includes(role.tag)
                        ) {
                            grant.allow = true
                        } else {
                            grant.allow = false
                        }
                        roles[role.tag].push(grant)
                    }
                }
            }

            for (let role of Object.keys(roles)) {
                await axios.patch(`role/${role}`, {
                    perms: roles[role],
                })
            }
            this.loading = false
            this.settingChanged = false
        },
    },
    async created() {
        await this.fetchRoles()
        await this.fetchBoards()
        await this.setInitBoardPerms()
    },
}
</script>
