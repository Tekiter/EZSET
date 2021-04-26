export interface AccessInfo {
    username: string
    roles: string[]
}

export interface StrictAccessInfo {
    username: string
    is_edit_token: boolean
}
