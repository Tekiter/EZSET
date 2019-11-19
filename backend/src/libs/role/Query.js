class Query {
    constructor({ role, mode }) {
        this.targetRole = role
        this._mode = mode
        this._resources = []
        this._params = []
    }

    resource(resource) {
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

    canAny(action) {}

    canOwn(action) {}

    can(action, type) {
        if (this._params.length === 0) {
            this._resources.forEach(reskey => {
                if (!this.targetRole[reskey]) {
                    this.targetRole[reskey] = []
                }

                if (Array.isArray(this.targetRole[reskey].all)) {
                    if (type) {
                        this.targetRole[reskey].all = convertToAnyOwn(
                            this.targetRole[reskey].all
                        )
                        // if (!Array.isArray(this.targetRole[reskey].all[type])) {
                        //     this.targetRole[reskey].all[type] = []
                        // }
                        // this.targetRole[reskey].all[type].push(action)
                        this.targetRole[reskey].all[
                            type
                        ] = forcePushIfNotExists(
                            this.targetRole[reskey].all[type],
                            action
                        )
                    } else {
                        this.targetRole[reskey].all.push(action)
                    }
                } else {
                    if (type) {
                        if (!Array.isArray(this.targetRole[reskey].all[type])) {
                            this.targetRole[reskey].all[type] = []
                        }
                        this.targetRole[reskey].all[type].push(action)
                    } else {
                        if (
                            !Array.isArray(this.targetRole[reskey].all['any'])
                        ) {
                            this.targetRole[reskey].all['any'] = []
                        }
                        this.targetRole[reskey].all['any'].push(action)

                        if (
                            !Array.isArray(this.targetRole[reskey].all['all'])
                        ) {
                            this.targetRole[reskey].all['all'] = []
                        }
                        this.targetRole[reskey].all['all'].push(action)
                    }
                }

                // if (type) {
                //     if (Array.isArray(this.targetRole[reskey])) {
                //         this.targetRole[reskey] = convertToAnyOwn(
                //             this.targetRole[reskey]
                //         )
                //     }

                //     if (Array.isArray(this.targetRole[reskey][type])) {
                //         this.targetRole[reskey][type].push(action)
                //     } else {
                //         this.targetRole[reskey][type] = [action]
                //     }
                // } else {
                // }
            })
        }
    }

    canNot(action) {}
}

function forcePushIfNotExists(arr, item) {
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
