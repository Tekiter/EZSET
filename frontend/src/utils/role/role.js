import Permission from './libs/Permission'
import store from '../../store'

export function checkPerm(resource, param) {
    const perms = store.state.role.perms
    const res = []

    perms.forEach(perm => {
        if (perm[resource]) {
            res.push(perm[resource])
        }
    })

    return new Permission(res, param)
}

// export function addPermComponent() {
//     Vue.component('perm', {
//         props: ['resource', 'param'],
//         data() {},
//         template: `<slot v-if=""></slot>`,
//     })
// }
