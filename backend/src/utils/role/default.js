export function setDefaultRole(roles) {
    roles.setRole({ tag: 'default', name: '모든 유저' })
    roles
        .role('default')

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

        .resource('schedule')
        .can('read')
}

export function setAdminRole(roles) {
    roles.setRole({ tag: 'admin', name: '관리자' })
    roles
        .role('admin')

        .resource('serverConfig')
        .can('change')

        .resource('profile')
        .can(['read', 'update'])

        .resource('user')
        .can(['delete'])

        .resource('role')
        .can(['read', 'modify'])

        .resource('board')
        .can(['read', 'create', 'delete', 'update'])

        .resource('manageServer')
        .can(['access'])
        .resource('manageUsers')
        .can('access')
        .resource('manageRoles')
        .can('access')
        .resource('manageAttendance')
        .can('access')
        .resource('manageHome')
        .can('update')

        .resource('manageBoards')
        .can('access')

        .resource('attendance')
        .can('update')

        .resource('absence')
        .can('update')

        .resource('schedule')
        .can('update')
}
