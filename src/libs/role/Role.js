import Permission from './Permission'
import Query from './Query'

class RoleSystem {
    constructor(...params) {
        this._roles = {}
        this._default = new Role({ tag: 'default', name: 'default' })
    }

    roleNames() {
        return Object.keys(this._roles).map(roletag => {
            return { tag: roletag, name: this._roles[roletag].name }
        })
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
        this._roles[tag] = new Role({ perm, name, tag })
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

    removeRole(roletag) {
        if (!this._roles[roletag]) {
            throw new Error('Invalid role tag')
        }

        delete this._roles[roletag]
    }

    export(roletag) {
        if (this._roles[roletag]) {
            return {
                tag: roletag,
                // perm: copyPerm(this._roles[roletag]._perm),
                name: this._roles[roletag].name,
                perm: this._roles[roletag].getPerm(),
            }
        } else {
            return undefined
        }
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
    constructor({ perm, name, tag }) {
        if (perm) {
            this._perm = copyPerm(perm)
        } else {
            this._perm = {}
        }
        this.name = name || 'unnamed role'
        this.tag = tag
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

    getPerm() {
        let result = {}

        result = copyPerm(this._perm)

        return result
    }
}

function copyPerm(perm) {
    let result = {}
    Object.keys(perm).forEach(resname => {
        let resource = {}

        if (perm[resname].all) {
            resource.all = copyGrant(perm[resname].all)
        }
        if (perm[resname].params) {
            resource.params = {}
            Object.keys(perm[resname].params).forEach(paramname => {
                resource.params[paramname] = copyGrant(
                    perm[resname].params[paramname]
                )
            })
        }

        result[resname] = resource
    })
    return result
}

function copyGrant(grant) {
    if (Array.isArray(grant)) {
        return [...grant]
    } else {
        const result = {}

        if (grant.any) {
            result.any = [...grant.any]
        }
        if (grant.own) {
            result.own = [...grant.own]
        }

        return result
    }
}

module.exports = {
    RoleSystem,
    Role,
}
