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
                    icon: 'mdi-settings',
                    title: '설정',

                    children: [
                        {
                            title: '유저 관리',
                            to: '/manage/users',
                            perm: this.$perm('manageUsers').can('access'),
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
                            title: '서버 설정',
                            to: '/manage/server',
                            perm: this.$perm('serverConfig').can('change'),
                        },
                    ],
                },
                {
                    type: 'simple',
                    icon: 'mdi-checkbox-marked-circle-outline',
                    title: '출석체크',
                    to: '/attendance',
                },
                {
                    type: 'simple',
                    icon: 'mdi-clipboard-multiple-outline',
                    title: '게시판',
                    to: '/board',
                    children: this.$store.getters['board/boardList'],
                },
            ]
        },
    },
}
</script>
