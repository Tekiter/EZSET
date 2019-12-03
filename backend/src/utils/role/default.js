export function setDefaultRole(roles) {
    roles
        .role('default')
        .resource('profile')
        .canOwn('read')
}

export function setAdminRole(roles) {
    roles
        .role('admin')
        .resource('profile')
        .can(['read', 'update'])
}
