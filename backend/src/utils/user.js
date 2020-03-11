import User from '../models/User'

export async function getRealname(username) {
    const res = await User.findOne()
        .where('username')
        .equals(username)
        .cache(60)
    if (res) {
        return res.info.realname || ''
    } else {
        return ''
    }
}
