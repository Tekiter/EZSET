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

    resource(resource) {
        this.clear()
        this._resource = resource
        if (Array.isArray(resource)) {
            resource.forEach(res => {
                this._resources.push(res)
            })
        } else {
            this._resources.push(resource)
        }
        return this
    }

    param(param) {
        this._params.push(param)
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

    canNot(action) {}
}

const typeAvailable = ['any', 'own']

function grantActionToPerms(obj, action, type) {
    if (Array.isArray(obj)) {
        if (type) {
            let newobj = convertToAnyOwn(obj)
            newobj[type] = forcePushArray(newobj[type], action)
            return newobj
        } else {
            obj.push(action)
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

function forcePushArray(arr, item) {
    if (!Array.isArray(arr)) {
        return [item]
    }

    if (arr.indexOf(item) < 0) {
        arr.push(item)
    }

    return arr
}

function convertToAnyOwn(permarr) {
    return { any: [...permarr], own: [...permarr] }
}

module.exports = Query
