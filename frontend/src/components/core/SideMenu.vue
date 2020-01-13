<template>
    <v-list dense>
        <template v-for="(menu, index) in mainMenus">
            <v-list-item
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
            </v-list-item>
        </template>
    </v-list>
</template>
<style scoped></style>
<script>
export default {
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
                },
                {
                    type: 'simple',
                    icon: 'mdi-checkbox-marked-circle-outline',
                    title: '출석체크',
                    to: '/attendance',
                },
                {
                    type: 'simple',
                    icon: 'mdi-checkbox-marked-circle-outline',
                    title: '일별출석현황',
                    to: '/AttendanceManageDay',
                },
            ],
        }
    },
}
</script>
