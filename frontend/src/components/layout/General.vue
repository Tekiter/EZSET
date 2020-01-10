<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" app clipped>
            <side-menu></side-menu>
        </v-navigation-drawer>

        <v-app-bar app clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>EZSET</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu offset-y :nudge-width="200">
                <template v-slot:activator="{ on }">
                    <v-btn text large v-on="on" class="text-none">
                        {{
                        user.username
                        }}
                    </v-btn>
                </template>
                <v-card>
                    <v-list>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon>fas fa-user</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{
                                    user.username
                                    }}
                                </v-list-item-title>
                                <v-list-item-subtitle></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn text @click="logout">로그아웃</v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list>
                        <v-list-item to="/user">사용자 정보</v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-app-bar>

        <v-content>
            <router-view></router-view>
        </v-content>

        <v-footer app>&copy; EZSET</v-footer>
    </v-app>
</template>
<style scoped></style>
<script>
import { mapState } from 'vuex'
import SideMenu from '../core/SideMenu.vue'

export default {
    components: {
        SideMenu,
    },
    data() {
        return {
            drawer: true,
        }
    },
    computed: {
        ...mapState('auth', ['user']),
    },
    methods: {
        async logout() {
            await this.$store.dispatch('auth/logout')
            await this.$store.dispatch('role/destroyPermission')
            this.$router.push({ path: '/login' })
        },
    },
}
</script>
