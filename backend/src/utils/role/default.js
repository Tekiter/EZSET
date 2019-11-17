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
