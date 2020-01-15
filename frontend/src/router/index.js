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
