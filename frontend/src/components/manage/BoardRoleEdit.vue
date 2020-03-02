<template>
    <v-card outlined>
        <v-toolbar flat>
            <v-toolbar-title>
                게시판 권한
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
        <v-list subheader>
            <board-perm-edit
                v-model="board.roles"
                v-for="board in boards"
                :key="`board-${board._id}`"
                :roles="roles"
                :board="board"
                :actions="actions"
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
                name: '다른 유저의 글 삭제',
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
            let res = await axios.get('role')
            const roleNames = res.data
            this.roles = []
            for (let role of roleNames) {
                res = await axios.get(`role/${role.tag}`)
                this.roles.push({
                    name: role.name,
                    tag: role.tag,
                    perm: res.data.perm,
                })
                // this.roleChecker[role.tag] = new Role({
                //     perm: res.data.perm,
                // }).createPermChecker()
                this.roleChecker[role.tag] = (resource, params) => {
                    return new Permission(res.data.perm[resource] || [], params)
                }
            }

            this.loading = false
        },
        async setInitBoardPerms() {
            for (let board of this.boards) {
                const newroles = []
                for (let action of this.actions) {
                    const selectedRoles = this.roles.filter(role =>
                        this.roleChecker[role.tag]('board', board._id).can(
                            action.key
                        )
                    )
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
        },
        async saveChanges() {},
    },
    async created() {
        await this.fetchRoles()
        await this.fetchBoards()
        await this.setInitBoardPerms()
    },
}
</script>
