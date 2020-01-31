<template>
    <v-list dense>
        <side-menu-item
            v-for="(menu, index) in mainMenus"
            :options="menu"
            :key="index"
        />
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

                    children: [
                        {
                            title: '유저 관리',
                            to: '/manage/users',
                            perm: this.$perm('role').can('read'),
                        },
                    ],
                },
                {
                    type: 'simple',
                    icon: 'mdi-checkbox-marked-circle-outline',
                    title: '출석',

                    children: [
                        {
                            title: '출석체크',
                            to: '/attendance',
                            perm: this.$perm('attendance').can('att'),
                        },
                        {
                            title: '월별출석현황',
                            to: '/AttendanceManageMonth',
                            perm: this.$perm('attendance').can('read'),
                        },
                        {
                            title: '출석현황',
                            to: '/AttendanceManageMonthUser',
                            perm: this.$perm('attendance').canOwn('read'),
                        },
                        {
                            title: '공결승인',
                            to: '/OfficialAbsenceAccept',
                            perm: this.$perm('attendance').can('read'),
                        },
                    ],
                },
            ],
        }
    },
}
</script>
