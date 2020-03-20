// import { userRole, adminRole } from '../src/utils/role/default'
import { Role, RoleSystem } from '../../src/libs/role'

export const adminRole = {
    profile: {
        all: ['read', 'update', 'delete'],
        params: {
            password: ['!read', 'update'],
        },
    },
    board: {
        all: ['read', 'write'],
    },
}

export const userRole = {
    profile: {
        all: {
            any: ['read'],
            own: ['read', 'update', 'delete'],
        },
        params: {
            password: {
                any: ['!read'],
                own: ['!read'],
            },
        },
    },
    board: {
        all: ['read', 'write'],
        params: {
            '12': ['!write'],
        },
    },
}

describe('Role class test', () => {
    const role = new Role({ perm: userRole })

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
    roles.setRole({ tag: 'user', perm: userRole })
    roles.setRole({ tag: 'admin', perm: adminRole })

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

describe('role modify test', () => {
    test('add role', () => {
        const roles = new RoleSystem()
        roles.setRole({
            tag: 'user',
            perm: {
                profile: {
                    all: {
                        any: ['read'],
                        own: ['read', 'write'],
                    },
                },
            },
        })

        const perm = roles.createPermChecker('user')

        expect(perm('profile').can('read')).toBeTruthy()
        expect(perm('profile').can('write')).toBeFalsy()
        expect(perm('profile').canOwn('read')).toBeTruthy()
        expect(perm('profile').canOwn('write')).toBeTruthy()
    })

    // test('add multiple roles', () => {})
})

describe('role grant test', () => {
    test('can', () => {
        const roles = new RoleSystem()

        roles
            .role('user')

            .resource('profile')
            .can('read')
            .canOwn(['update', 'delete'])

            .resource('profile', 'password')
            .cannot(['read', 'delete'])

            .resource('board', '0')
            .can('read')
            .cannot('write')

        const perm = roles.createPermChecker('user')

        expect(perm('profile').can('read')).toBeTruthy()
        expect(perm('profile').canOwn('read')).toBeTruthy()
        expect(perm('profile').can('update')).toBeFalsy()
        expect(perm('profile').canOwn('update')).toBeTruthy()
        expect(perm('profile').can('delete')).toBeFalsy()
        expect(perm('profile').canOwn('delete')).toBeTruthy()
        expect(perm('profile', 'password').can('read')).toBeFalsy()
        expect(perm('profile', 'password').canOwn('read')).toBeFalsy()
        expect(perm('profile', 'password').can('update')).toBeFalsy()
        expect(perm('profile', 'password').canOwn('update')).toBeTruthy()
        expect(perm('profile', 'password').canOwn('delete')).toBeFalsy()
        expect(perm('board', '0').can('read')).toBeTruthy()
        expect(perm('board', '0').can('write')).toBeFalsy()
        expect(perm('board', '1').can('read')).toBeFalsy()
    })

    test('cannot', () => {
        const roles = new RoleSystem()

        roles
            .role('user')
            .resource('profile')
            .can('read')
            .resource('profile', 'password')
            .cannot('read')
            .canOwn('read')
            .cannotAny('read')

        const perm = roles.createPermChecker('user')
        // console.log(perm('profile'))

        expect(perm('profile').can('read')).toBeTruthy()
        expect(perm('profile', 'password').can('read')).toBeFalsy()
        expect(perm('profile', 'password').canOwn('read')).toBeTruthy()
    })
})

describe('default role test', () => {
    test('default', () => {
        const roles = new RoleSystem()

        roles
            .default()
            .resource('profile')
            .can('read')

        const perm = roles.createPermChecker('user')

        expect(perm('profile').can('read')).toBeTruthy()
    })
})

describe('role export test', () => {
    test('get perm', () => {
        const roles = new RoleSystem()

        roles
            .role('user')
            .resource('profile')
            .can('read')
            .resource('profile', 'password')
            .cannot('read')
            .canOwn('read')
            .cannotAny('read')
        roles
            .role('admin')
            .resource('profile')
            .can(['read', 'edit'])

        expect(JSON.stringify(roles.getRole('user')._perm)).toEqual(
            JSON.stringify(roles.export('user').perm)
        )
        expect(JSON.stringify(roles.getRole('admin')._perm)).toEqual(
            JSON.stringify(roles.export('admin').perm)
        )
    })
})
