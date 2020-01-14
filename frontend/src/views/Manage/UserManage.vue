<template>
    <div class="">
        <!-- <h2 class="display-1">유저</h2> -->
        <v-data-iterator :items="users" :search="toolbar.search">
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
                    ></v-text-field>
                </v-toolbar>
            </template>
            <template v-slot:default="props">
                <v-row class="mx-2">
                    <v-col
                        v-for="user in props.items"
                        :key="user.username"
                        cols="12"
                        sm="6"
                    >
                        <v-card>
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
                                            {{ userrole }}
                                        </v-chip>
                                        <v-btn
                                            icon
                                            small
                                            class="align-self-center"
                                        >
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </div>
                                    <div class="d-flex pl-3">
                                        <v-btn icon>
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
    </div>
</template>
<script>
import axios from 'axios'

export default {
    data() {
        return {
            users: [],
            roles: [],
            fetchingCount: 0,
            totalCount: 0,
            toolbar: {
                search: '',
            },
        }
    },
    computed: {
        isFetching() {
            return this.fetchingCount > 0
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

                this.roles = roles.data
            } finally {
                this.fetchingCount -= 1
            }
        },
    },
    async created() {
        await Promise.all([this.fetchUsers(), this.fetchRoles()])
    },
}
</script>
