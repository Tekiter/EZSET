import Permission from './Permission'
import Query from './Query'

class RoleSystem {
    constructor(...params) {
        this._roles = {}
    }

    setRole(roletag, roleobj) {
        if (!roleobj) {
            roleobj = {}
        }
        if (roleobj instanceof Role) {
            this._roles[roletag] = roleobj
        } else {
            this._roles[roletag] = new Role(roleobj)
        }
    }

    getRole(roletag) {
        return this._roles[roletag]
    }

    role(roletag) {
        if (!this._roles[roletag]) {
            this.setRole(roletag, {})
        }
        return new Query({ role: this._roles[roletag], mode: 'grant' })
    }

    hasRole(roletag) {
        return !!this._roles[roletag]
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
        if (!this._role[name]) {
            this._role[name] = {}
        }
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
