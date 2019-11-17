export const userRole = {
    profile: {
        all: {
            any: ['read'],
            own: ['read', 'update', 'delete'],
        },
        params: {
            password: ['!read'],
        },
    },
    board: {
        all: ['read', 'write'],
        params: {
            '12': ['!write'],
        },
    },
}
