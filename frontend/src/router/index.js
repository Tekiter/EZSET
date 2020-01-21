import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store'
import { loginGuard } from './guard'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
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
        component: () => import('../views/Attendance.vue'),
    },
    {
        path: '/attendanceManageDay',
        name: 'attendanceManage',
        component: () => import('../views/AttendanceManageDay.vue'),
    },
    {
        path: '/board',
        name: 'board',
        component: () => import('../views/Board.vue'),
    },
    {
        path: '/board/:board_id',
        name: 'post',
        component: () => import('../views/Post.vue'),
    },
    {
        path: '/post/:post_id',
        name: 'content',
        component: () => import('../views/Content.vue'),
    },
    {
        path: '/write/:board_id',
        name: 'write',
        component: () => import('../views/WritePost.vue'),
    },
    {
        path: '/update/:post_id',
        name: 'update',
        component: () => import('../views/UpdatePost.vue'),
    },
    {
        path: '/manage/users',
        name: 'manageUsers',
        component: () => import('../views/Manage/UserManage.vue'),
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
        path: '/403',
        name: 'error403',
        component: () => import('../views/Error/403.vue'),
    },
    {
        path: '*',
        name: 'error404',
        component: () => import('../views/Error/404.vue'),
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
