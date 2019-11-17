import { userRole } from '../src/utils/role/default'
import { Role } from '../src/libs/role'

const hello = {
    a: 1234,
    b: {
        c: 12345,
    },
}

describe('Role class test', () => {
    const role = new Role(userRole)

    test('can any', () => {
        const perm = role.createPermChecker()
        expect(perm('profile').can('read')).toBe(true)
        expect(perm('profile', 'password').can('read')).toBe(false)
        expect(perm('board').can('write')).toBe(true)
        expect(perm('board').can('nono')).toBe(false)
        expect(perm('board', '11').can('write')).toBe(true)
        expect(perm('board', '12').can('write')).toBe(false)
    })

    test('can own', () => {
        const perm = role.createPermChecker()
        expect(perm('profile').can('read')).toBe(true)
        expect(perm('profile').can('read')).toBe(true)
        expect(perm('profile', 'password').can('read')).toBe(false)
        expect(perm('board').can('write')).toBe(true)
        expect(perm('board').can('nono')).toBe(false)
        expect(perm('board', '11').can('write')).toBe(true)
        expect(perm('board', '12').can('write')).toBe(false)
    })
})
