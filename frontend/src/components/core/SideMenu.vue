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
import moment from 'moment'
export default {
    components: { SideMenuItem },
    data() {
        return {}
    },
    computed: {
        mainMenus() {
            return [
                {
                    type: 'simple',
                    icon: 'mdi-view-dashboard',
                    title: '홈',
                    to: '/',
                },
                {
                    type: 'simple',
                    icon: 'mdi-cog-outline',
                    title: '설정',

                    children: [
                        {
                            title: '유저 관리',
                            to: '/manage/users',
                            perm: this.$perm('manageUsers').can('access'),
                        },
                        {
                            title: '가입 승인',
                            to: '/manage/preusers',
                            perm: this.$perm('managePreusers').can('access'),
                        },
                        {
                            title: '역할 관리',
                            to: '/manage/roles',
                            perm: this.$perm('role').can('modify'),
                        },
                        {
                            title: '게시판 관리',
                            to: '/manage/boards',
                            perm: this.$perm('manageBoards').can('access'),
                        },
                        {
                            title: '상벌점 설정',
                            to: '/manage/penalty',
                            perm: this.$perm('attendance').can('update'),
                        },
                        {
                            title: '서버 설정',
                            to: '/manage/server',
                            perm: this.$perm('serverConfig').can('change'),
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
                            title: '일별출석현황',
                            to: `/AttendanceManageDay/${moment().format("YYYYMMDD")}`,
                            perm: this.$perm('attendance').can('update'),
                        },
                        {
                            title: '월별출석현황',
                            to: '/AttendanceManageMonth',
                            perm: this.$perm('attendance').can('update'),
                        },
                        {
                            title: '출석현황',
                            to: '/AttendanceManageMonthUser',
                            perm: this.$perm('attendance').canOwn('read'),
                        },
                        {
                            title: '공결승인',
                            to: '/OfficialAbsenceAccept',
                            perm: this.$perm('absence').can('update'),
                        },
                        {
                            title: '출석 설정',
                            to: '/manage/attendance',
                            perm: this.$perm('attendance').can('update'),
                        },
                    ],
                },
                {
                    type: 'simple',
                    icon: 'mdi-clipboard-multiple-outline',
                    title: '게시판',
                    to: '/board',
                    children: this.$store.getters['board/boardList'],
                },
                {
                    type: 'simple',
                    icon: 'mdi-package-variant-closed',
                    title: '자료실',
                    to: '/filebox',
                },
                {
                    icon: 'mdi-calendar-month ',
                    title: '일정표',
                    to: '/Schedule',
                    perm: this.$perm('schedule').can('read'),
                },
                {
                    icon: 'mdi-thumb-up-outline',
                    title: '상벌점',
                    to: '/PenaltyManage',
                    perm: this.$perm('penalty').can('update'),
                },
                {
                    icon: 'mdi-thumb-up-outline',
                    title: '상벌점 조회',
                    to: '/Penalty',
                    perm: this.$perm('penalty').can('read'),
                },
            ]
        },
    },
}
</script>
