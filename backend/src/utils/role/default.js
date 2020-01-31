export function setDefaultRole(roles) {
    roles
        .default()

        .resource('profile')
        .canOwn('read')

        .resource('role')
        .canOwn('read')

        .resource('attendance')
        .canOwn('read')
        .can('att')

        .resource('absence')
        .canOwn(['create', 'read', 'delete'])
}

export function setAdminRole(roles) {
    roles
        .role('admin')

        .resource('profile')
        .can(['read', 'update'])

        .resource('role')
        .can(['read', 'create', 'delete', 'update'])

        .resource('attendance')
        .can(['start', 'att', 'read', 'update'])

        .resource('attendance')
        .canOwn('read')
        .can(['start', 'att', 'read', 'update'])

        .resource('absence')
        .canOwn(['create', 'read', 'delete'])
        .can(['create', 'read', 'delete'])
}
