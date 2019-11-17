import { userRole, adminRole } from '../src/utils/role/default'
import { Role, RoleSystem } from '../src/libs/role'

describe('Role class test', () => {
    const role = new Role(userRole)

    test('can any', () => {
        const perm = role.createPermChecker()
        expect(perm('profile').can('read')).toBeTruthy()
        expect(perm('profile').can('update')).toBeFalsy()
        expect(perm('profile', 'password').can('read')).toBeFalsy()
        expect(perm('board').can('write')).toBeTruthy()
        expect(perm('board').can('nono')).toBeFalsy()
        expect(perm('board', '11').can('write')).toBeTruthy()
        expect(perm('board', '12').can('write')).toBeFalsy()
    })

    test('can own', () => {
        const perm = role.createPermChecker()
        expect(perm('profile').canOwn('read')).toBeTruthy()
        expect(perm('profile').canOwn('update')).toBeTruthy()
        expect(perm('profile', 'password').canOwn('read')).toBeFalsy()
        expect(perm('board').canOwn('write')).toBeTruthy()
        expect(perm('board').canOwn('nono')).toBeFalsy()
        expect(perm('board', '11').canOwn('write')).toBeTruthy()
        expect(perm('board', '12').canOwn('write')).toBeFalsy()
    })
})

describe('role system test', () => {
    const roles = new RoleSystem()
    roles.setRole('user', userRole)
    roles.setRole('admin', adminRole)

    test('profile: user + admin', () => {
        const perm = roles.createPermChecker(['user', 'admin'])

        expect(perm('profile').can('update')).toBeTruthy()
        expect(perm('profile', 'password').can('read')).toBeFalsy()
        expect(perm('profile', 'password').can('update')).toBeTruthy()
        expect(perm('profile', 'password').can('write')).toBeFalsy()
        expect(perm('profile').can('wrongval')).toBeFalsy()
    })

    test('board: user + admin', () => {
        const perm = roles.createPermChecker(['user', 'admin'])
        expect(perm('board').can('read')).toBeTruthy()
    })
})
