import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

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
        path: '/attendancestatus',
        name: 'attendancestatus',
        component: () => import('../views/Attendancestatus.vue'),
    },
    {
        path: '/attendanceManageDay/:day',
        name: 'attendanceManage',
        component: () => import('../views/AttendanceManageDay.vue'),
    },
    {
        path: '/attendanceManageMonth',
        name: 'attendanceManageMonth',
        component: () => import('../views/AttendanceManagMonth.vue'),
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

// 비로그인시 로그인 화면으로
router.beforeEach(function(to, from, next) {
    if (!to.matched.some(record => record.meta.noLoginRequired)) {
        if (!store.getters['auth/isLoggedIn']) {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
