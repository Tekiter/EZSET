import Permission from './Permission'
import Query from './Query'

class RoleSystem {
    constructor(...params) {
        this._roles = {}
        this._default = new Role({ tag: 'default', name: 'default' })
    }

    setRole({ tag, perm, name }) {
        if (!perm) {
            perm = {}
        }
        // if (perm instanceof Role) {
        //     this._roles[tag] = perm
        // } else {
        //     this._roles[tag] = new Role(perm)
        // }
        this._roles[tag] = new Role({ perm, name })
    }

    getRole(roletag) {
        return this._roles[roletag]
    }

    role(roletag) {
        if (!this._roles[roletag]) {
            this.setRole({ tag: roletag, perm: {} })
        }
        return new Query({ role: this._roles[roletag], mode: 'grant' })
    }

    getDefault() {
        return this._default
    }

    // setDefault(defaultRole) {
    //     this._default = defaultRole
    // }

    default() {
        return new Query({ role: this._default })
    }

    hasRole(roletag) {
        return !!this._roles[roletag]
    }

    createPermChecker(roles) {
        if (!Array.isArray(roles)) {
            roles = [roles]
        }

        // roles = [this.getDefault(), ...roles]

        return (resource, param) => {
            let resources = []

            if (this.getDefault().resource(resource)) {
                resources.push(this.getDefault().resource(resource))
            }

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
    constructor({ perm, name }) {
        if (perm) {
            this._perm = perm
        } else {
            this._perm = {}
        }
        this.name = name
    }

    resource(name) {
        if (!this._perm[name]) {
            this._perm[name] = {}
        }
        return this._perm[name]
    }

    createPermChecker() {
        return (resource, param) => {
            return new Permission(this._perm[resource], param)
        }
    }
}

module.exports = {
    RoleSystem,
    Role,
}
