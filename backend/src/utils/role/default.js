export const adminRole = {
    board: {
        read: {
            any: {
                all: true,
            },
            own: {
                all: true,
            },
        },
        write: [],
        create: [],
    },
}

// export const userRole = {
//     profile: {
//         read: {
//             any: {
//                 all: true,
//             },
//         },
//         update: {
//             own: {
//                 all: true,
//             },
//         },
//     },
//     board: {
//         read: {
//             any: {
//                 all: true,
//             },
//             own: {
//                 all: true,
//             },
//         },
//         write: {
//             any: {},
//         },
//     },
// }

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
