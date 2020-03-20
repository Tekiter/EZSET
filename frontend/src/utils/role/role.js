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

    return new Permission(res, param != undefined ? param + '' : undefined)
}

export function filterAllPerms(perms) {
    //
    const res = {}

    for (let resource of Object.keys(perms)) {
        if (perms[resource].all) {
            res[resource] = { all: perms[resource].all }
        }
    }
    //
    return res
}

// export function flattenPerms(perms) {
//     const res = {}
//     for (let resource of perms) {

//     }
//     return res
// }

// export function addPermComponent() {
//     Vue.component('perm', {
//         props: ['resource', 'param'],
//         data() {},
//         template: `<slot v-if=""></slot>`,
//     })
// }
