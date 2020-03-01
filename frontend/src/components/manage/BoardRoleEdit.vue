<template>
    <v-card outlined>
        <v-toolbar flat>
            <v-toolbar-title>
                게시판 권한
            </v-toolbar-title>
        </v-toolbar>
        <v-list subheader>
            <board-perm-edit
                v-for="board in boards"
                :key="`board-${board._id}`"
                :roles="roles"
                :board="board"
            ></board-perm-edit>
        </v-list>
    </v-card>
</template>

<script>
import axios from 'axios'
import BoardPermEdit from './BoardPermEdit.vue'

export default {
    components: {
        BoardPermEdit,
    },
    data: () => ({
        boards: [],
        roles: [],
        loading: false,
    }),
    methods: {
        async fetchBoards() {
            this.loading = true
            const res = await axios.get('simple/boards')
            this.boards = res.data
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
            }

            this.loading = false
        },
    },
    async created() {
        await this.fetchRoles()
        await this.fetchBoards()
    },
}
</script>
