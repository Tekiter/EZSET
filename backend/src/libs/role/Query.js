class Query {
    constructor({ role, mode }) {
        this.targetRole = role
        this._mode = mode
        this._resources = []
        this._resource = undefined
        this._params = []
    }

    clear() {
        this._resources = []
        this._resource = undefined
        this._params = []
    }

    resource(resource, param) {
        this.clear()
        this._resource = resource
        if (Array.isArray(resource)) {
            resource.forEach(res => {
                this._resources.push(res)
            })
        } else {
            this._resources.push(resource)
        }

        if (param) {
            return this.param(param)
        }

        return this
    }

    param(param) {
        if (Array.isArray(param)) {
            this._params.push(...param)
        } else {
            this._params.push(param)
        }
        return this
    }

    canAny(action) {
        return this.can(action, 'any')
    }

    canOwn(action) {
        return this.can(action, 'own')
    }

    can(actions, type) {
        if (!Array.isArray(actions)) {
            actions = [actions]
        }

        const resKey = this._resource
        if (!resKey) {
            throw new Error('Need a resource to be granted.')
        }

        const targetRes = this.targetRole.resource(resKey)

        actions.forEach(action => {
            if (this._params.length === 0) {
                if (!targetRes.all) {
                    targetRes.all = []
                }
                targetRes.all = grantActionToPerms(targetRes.all, action, type)
            } else {
                if (!targetRes.params) {
                    targetRes.params = {}
                }
                this._params.forEach(param => {
                    if (!targetRes.params[param]) {
                        targetRes.params[param] = []
                    }

                    targetRes.params[param] = grantActionToPerms(
                        targetRes.params[param],
                        action,
                        type
                    )
                })
            }
        })

        return this
    }

    cannot(action, type) {
        if (!Array.isArray(action)) {
            action = [action]
        }
        return this.can(action.map(i => `!${i}`), type)
    }

    cannotAny(action) {
        return this.cannot(action, 'any')
    }

    cannotOwn(action) {
        return this.cannot(action, 'own')
    }
}

const typeAvailable = ['any', 'own']

function grantActionToPerms(obj, action, type) {
    if (Array.isArray(obj)) {
        if (type) {
            let newobj = convertToAnyOwn(obj)
            newobj[type] = forcePushArray(newobj[type], action)
            return newobj
        } else {
            // obj.push(action)
            obj = forcePushArray(obj, action)
            return obj
        }
    } else {
        if (type) {
            obj[type] = forcePushArray(obj[type], action)
            return obj
        } else {
            typeAvailable.forEach(ntype => {
                obj[ntype] = forcePushArray(obj[ntype], action)
            })
            return obj
        }
    }
}

// function grantToAnyOwn(obj, action, type) {
//     if (!Array.isArray(obj[type])) {
//         obj[type] = forcePushArray(obj[type], action)
//     }
// }

function parseNeg(item) {
    let negcnt = 0
    let c
    for (c of item) {
        if (c !== '!') {
            break
        }
        negcnt++
    }
    return [negcnt, item.substr(negcnt)]
}

function forcePushArray(arr, item) {
    if (!Array.isArray(arr)) {
        return [item]
    }

    const [negcnt, pitem] = parseNeg(item)
    const isNeg = negcnt % 2 === 1

    if (isNeg) {
        const proidx = arr.indexOf(pitem)
        if (proidx >= 0) {
            arr.splice(proidx, 1)
        }

        if (arr.indexOf(`!${pitem}`) < 0) {
            arr.push(`!${pitem}`)
        }
    } else {
        const negidx = arr.indexOf(`!${item}`)
        if (negidx >= 0) {
            arr.splice(negidx, 1)
        }

        if (arr.indexOf(item) < 0) {
            arr.push(item)
        }
    }

    return arr
}

function convertToAnyOwn(permarr) {
    return { any: [...permarr], own: [...permarr] }
}

module.exports = Query
