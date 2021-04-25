"use strict";
function checkAction(arr, action) {
    if (arr.indexOf(action) >= 0) {
        return true;
    }
    if (arr.indexOf('!' + action) >= 0) {
        return false;
    }
    return undefined;
}
function hasPermission(permobj, type, action) {
    if (Array.isArray(permobj)) {
        return checkAction(permobj, action);
    }
    else {
        if (permobj[type]) {
            if (Array.isArray(permobj[type])) {
                return checkAction(permobj[type], action);
            }
            else {
                throw new Error(`'${type}' field should be an array.`);
            }
        }
        else {
            throw new Error(`'${type}' field should exist.`);
        }
    }
}
class Permission {
    constructor(resources, param) {
        if (!Array.isArray(resources)) {
            resources = [resources];
        }
        this.res = resources;
        this.param = param;
    }
    can(action, range) {
        range = range || 'any';
        let results = this.res.map(resource => {
            let result = false;
            if (!resource) {
                return false;
            }
            if (resource.all) {
                result = hasPermission(resource.all, range, action);
            }
            if (this.param) {
                if (resource.params && resource.params[this.param]) {
                    switch (hasPermission(resource.params[this.param], range, action)) {
                        case true:
                            return true;
                        case false:
                            return false;
                    }
                }
            }
            return !!result;
        });
        return results.indexOf(true) >= 0;
    }
    canOwn(action) {
        return this.can(action, 'own');
    }
}
module.exports = Permission;
//# sourceMappingURL=Permission.js.map