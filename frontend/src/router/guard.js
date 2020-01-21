import store from '../store'

export function multiGuard(guards) {
    return (to, from, next) => {
        const stack = [...guards]
        function realguard() {
            const guard = stack.pop()
            guard ? guard(to, from, realguard) : next()
        }
        realguard()
    }
}

export function loginGuard(to, from, next) {
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
}

export function permGuard(checker) {
    return (to, from, next) => {
        if (checker()) {
            next()
        } else {
            next({ name: 'error403' })
        }
    }
}
