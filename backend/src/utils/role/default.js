export function setDefaultRole(roles) {
    roles
        .default()

        .resource('profile')
        .canOwn('read')

        .resource('role')
        .canOwn('read')

        .resource('board')
        .can('read')

        .resource('attendance')
        .can('att')
}

export function setAdminRole(roles) {
    roles.setRole({ tag: 'admin', name: 'admin' })
    roles
        .role('admin')

        .resource('profile')
        .can(['read', 'update'])

        .resource('role')
        .can(['read', 'create', 'delete', 'update'])

        .resource('board')
        .can(['read', 'create', 'delete'])

        .resource('manageUsers')
        .can('access')

        .resource('attendance')
        .can(['start', 'att'])
}
