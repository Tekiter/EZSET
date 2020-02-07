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
        .canOwn('read')
        .can('att')

        .resource('absence')
        .canOwn(['create', 'read', 'delete'])
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
        .can(['read', 'create', 'delete', 'update'])

        .resource('manageServer')
        .can(['access'])
        .resource('manageUsers')
        .can('access')
        .resource('manageRoles')
        .can('access')

        .resource('manageBoards')
        .can('access')

        .resource('attendance')
        .canOwn('read')
        .can(['start', 'att', 'read', 'update'])

        .resource('absence')
        .canOwn(['create', 'read', 'delete'])
        .can(['create', 'read', 'delete'])
}
