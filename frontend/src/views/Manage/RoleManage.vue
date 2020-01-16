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
                <v-card tile minHeight="100%">
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
                <v-card :loading="curRole.userLoading" tile minHeight="100%">
                    <v-list>
                        <v-subheader>소속 유저</v-subheader>
                        <template v-if="curRole.userLoading">
                            <v-skeleton-loader
                                v-for="i in 7"
                                :key="`role-loading-${i}`"
                                type="list-item"
                            ></v-skeleton-loader>
                        </template>
                        <v-list-item-group v-else multiple>
                            <v-list-item
                                v-for="user in curRole.users"
                                :key="user.username"
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
                                        <v-list-item-title
                                            v-text="user.username"
                                        ></v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
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
            curRole: {
                tag: '',
                name: '',
                users: [],
                userLoading: false,
            },
        }
    },
    computed: {
        isLoading() {
            return this.fetchingCount > 0
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
        async getRoleUsers(role) {
            const res = await axios.get(`role/${role.tag}/users`)
            return res.data.users
        },
        async switchRole(role) {
            this.curRole.tag = role.tag
            this.curRole.name = role.name
            this.curRole.userLoading = true
            this.curRole.users = await this.getRoleUsers(role)
            this.curRole.userLoading = false
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
    },
    // async mounted() {
    // },
}
</script>
