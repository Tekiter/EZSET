<template>
    <v-list dense>
        <template v-for="(menu, index) in mainMenus">
            <!-- <v-list-item
                v-if="menu.type == 'simple' && menu.perm != false"
                :key="index"
                :to="menu.to"
            >
                <v-list-item-action>
                    <v-icon>{{ menu.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ menu.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item> -->
            <side-menu-item :options="menu" :key="index" />
        </template>
    </v-list>
</template>
<style scoped></style>
<script>
import SideMenuItem from './SideMenuItem.vue'

export default {
    components: { SideMenuItem },
    data() {
        return {
            mainMenus: [
                {
                    type: 'simple',
                    icon: 'mdi-view-dashboard',
                    title: '홈',
                    to: '/',
                },
                {
                    type: 'simple',
                    icon: 'mdi-settings',
                    title: '설정',
                    to: '/settings',
                    perm: this.$perm('role').can('read'),
                    children: [
                        {
                            title: '내부설정',
                            to: '/innerset',
                            children: [
                                {
                                    title: '또다른 내부',
                                    to: '/innn',
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    },
}
</script>
