export function setDefaultRole(roles) {
    roles
        .default()

        .resource('profile')
        .canOwn('read')

        .resource('role')
        .canOwn('read')

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

        .resource('manageUsers')
        .can('access')
        .resource('manageRoles')
        .can('access')

        .resource('attendance')
        .can(['start', 'att'])
}
