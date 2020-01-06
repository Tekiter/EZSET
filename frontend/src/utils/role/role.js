import { RoleSystem } from './libs/Role'

const roles = new RoleSystem()

export function createChecker(roleList) {
    return roles.createPermChecker(roleList)
}

export function checkPerm() {}
