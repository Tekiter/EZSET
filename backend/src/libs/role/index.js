export class RoleSystem {
    constructor(...params) {
        this._roles = {}
    }
}

export class Role {
    constructor(roleobj) {
        this._role = roleobj
    }

    createPermChecker() {
        return (resource, param) => {
            return new Permission(this._role[resource], param)
        }
    }
}

export class Resource {}

function checkAction(arr, action) {
    if (arr.indexOf(action) >= 0) {
        return true
    }
    if (arr.indexOf('!' + action) >= 0) {
        return false
    }
    return undefined
}

function hasPermission(permobj, type, action) {
    if (Array.isArray(permobj)) {
        return checkAction(permobj, action)
    } else {
        if (permobj[type]) {
            if (Array.isArray(permobj[type])) {
                return checkAction(permobj[type], action)
            } else {
                throw new Error(`'${type}' field should be an array.`)
            }
        } else {
            throw new Error(`'${type}' field should exist.`)
        }
    }
}

export class Permission {
    constructor(resource, param) {
        this.res = resource
        this.param = param
    }

    can(action, range) {
        range = range || 'any'
        let result = false

        if (this.res.all) {
            if (hasPermission(this.res.all, range, action)) {
                result = true
            }
        }

        if (this.param) {
            if (this.res.params && this.res.params[this.param]) {
                switch (
                    hasPermission(this.res.params[this.param], range, action)
                ) {
                    case true:
                        return true
                    case false:
                        return false
                }
            }
        }

        return result
    }

    canOwn(action) {
        this.can(action, 'own')
    }
}
