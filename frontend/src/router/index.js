import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store'
import { loginGuard } from './guard'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () =>
            import(/* webpackChunkName: "core" */ '../views/Home.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import(/* webpackChunkName: "core" */ '../views/Login.vue'),
        meta: {
            layout: 'empty',
            noLoginRequired: true,
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue'),
        meta: {
            layout: 'null',
            noLoginRequired: true,
        },
    },
    {
        path: '/attendance',
        name: 'attendance',
        component: () => import('../views/Attendance/Attendance.vue'),
    },
    {
        path: '/attendanceManageDay/:day',
        name: 'attendanceManage',
        component: () => import('../views/Attendance/AttendanceManageDay.vue'),
    },
    {
        path: '/attendanceManageMonth',
        name: 'attendanceManageMonth',
        component: () =>
            import('../views/Attendance/AttendanceManageMonth.vue'),
    },
    {
        path: '/attendanceManageMonthUser',
        name: 'attendanceManageMonthUser',
        component: () =>
            import('../views/Attendance/AttendanceManageMonthUser.vue'),
    },
    {
        path: '/officialAbsenceAccept',
        name: 'officialAbsenceAccept',
        component: () =>
            import('../views/Attendance/OfficialAbsenceAccept.vue'),
    },
    {
        path: '/manage/attendance',
        name: 'attendanceusermanage',
        component: () => import('../views/Attendance/AttendanceManage.vue'),
    },
    {
        path: '/Schedule',
        name: 'Schedule',
        component: () => import('../views/Schedule/Schedule.vue'),
    },
    {
        path: '/board/:board_id',
        name: 'post',
        component: () =>
            import(/* webpackChunkName: "board" */ '../views/Board/Post.vue'),
    },
    {
        path: '/board/:board_id/:post_id',
        name: 'content',
        component: () =>
            import(
                /* webpackChunkName: "board" */ '../views/Board/Content.vue'
            ),
    },
    {
        path: '/write/:board_id',
        name: 'write',
        component: () => import('../views/Board/WritePost.vue'),
    },
    {
        path: '/update/:board_id/:post_id',
        name: 'update',
        component: () => import('../views/Board/UpdatePost.vue'),
    },
    {
        path: '/searchpost',
        name: 'serchPost',
        component: () =>
            import(
                /* webpackChunkName: "board" */ '../views/Board/SearchPost.vue'
            ),
    },
    {
        path: '/manage/users',
        name: 'manageUsers',
        component: () => import('../views/Manage/UserManage.vue'),
    },
    {
        path: '/manage/preusers',
        name: 'managePreusers',
        component: () => import('../views/Manage/PreuserManage.vue'),
    },
    {
        path: '/manage/roles',
        name: 'manageRoles',
        component: () => import('../views/Manage/RoleManage.vue'),
    },
    {
        path: '/manage/boards',
        name: 'manageBoards',
        component: () => import('../views/Manage/BoardManage.vue'),
    },
    {
        path: '/manage/server',
        name: 'manageServer',
        component: () => import('../views/Manage/ServerManage.vue'),
    },
    {
        path: '/manage/theme',
        name: 'manageTheme',
        component: () => import('../views/Manage/ThemeManage.vue'),
    },
    {
        path: '/mypage',
        name: 'mypage',
        component: () => import('../views/Mypage.vue'),
    },
    {
        path: '/filebox',
        component: () =>
            import(
                /* webpackChunkName: "filebox" */ '../views/FileBox/FileBox.vue'
            ),
        children: [
            {
                path: '',
                name: 'fileBoxEmpty',
            },
            {
                path: 'create',
                component: () =>
                    import(
                        /* webpackChunkName: "filebox" */ '../components/filebox/CreateGroup'
                    ),
            },
            {
                path: 'edit',
                name: 'fileboxEditGroup',
                component: () =>
                    import(
                        /* webpackChunkName: "filebox" */ '../components/filebox/EditGroup'
                    ),
                props: route => ({ groups: route.params.groups }),
            },
            {
                path: 'folder/:folder_id',
                name: 'fileBoxMaterials',
                component: () =>
                    import(
                        /* webpackChunkName: "filebox" */ '../components/filebox/MaterialPost.vue'
                    ),
                props: route => ({ folderId: route.params.folder_id }),
            },
            {
                path: 'folder/:folder_id/write',
                name: 'fileBoxWriteMaterial',
                component: () =>
                    import(
                        /* webpackChunkName: "filebox" */ '../components/filebox/WriteMaterial.vue'
                    ),
                props: route => ({ parent_id: route.params.folder_id }),
            },
            {
                path: 'edit/:material_id',
                name: 'fileBoxEditMaterial',
                component: () =>
                    import(
                        /* webpackChunkName: "filebox" */ '../components/filebox/WriteMaterial.vue'
                    ),
                props: route => ({
                    edit: route.params.material_id,
                }),
            },
        ],
    },
    {
        path: '/403',
        name: 'error403',
        component: () =>
            import(/* webpackChunkName: "core" */ '../views/Error/403.vue'),
    },
    {
        path: '*',
        name: 'error404',
        component: () =>
            import(/* webpackChunkName: "core" */ '../views/Error/404.vue'),
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

// 비로그인시 로그인 화면으로
router.beforeEach(loginGuard)

export default router
