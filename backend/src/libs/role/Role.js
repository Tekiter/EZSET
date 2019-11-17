import Permission from './Permission'

class RoleSystem {
    constructor(...params) {
        this._roles = {}
    }

    setRole(roletag, roleobj) {
        if (roleobj instanceof Role) {
            this._roles[roletag] = roleobj
        } else {
            this._roles[roletag] = new Role(roleobj)
        }
    }

    createPermChecker(roles) {
        if (!Array.isArray(roles)) {
            roles = [roles]
        }

        return (resource, param) => {
            let resources = []
            roles.forEach(rname => {
                if (
                    this._roles[rname] &&
                    this._roles[rname].resource(resource)
                ) {
                    resources.push(this._roles[rname].resource(resource))
                }
            })

            return new Permission(resources, param)
        }
    }
}

class Role {
    constructor(roleobj) {
        if (roleobj) {
            this._role = roleobj
        } else {
            this._role = {}
        }
    }

    resource(name) {
        return this._role[name]
    }

    createPermChecker() {
        return (resource, param) => {
            return new Permission(this._role[resource], param)
        }
    }
}

module.exports = {
    RoleSystem,
    Role,
}
