import { DocumentQuery } from 'mongoose'
import User, { UserDocument } from '../models/User'

interface CacheQuery extends DocumentQuery<UserDocument, UserDocument> {
    cache(time: number): DocumentQuery<UserDocument, UserDocument>
}

export async function getRealname(username: string): Promise<string> {
    let query: CacheQuery = User.findOne()
        .where('username')
        .equals(username) as CacheQuery

    query = query.cache(60) as CacheQuery

    const res = await query

    if (res) {
        return res.info.realname || ''
    } else {
        return ''
    }
}
