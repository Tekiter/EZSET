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

export function isValidUsername(username: string): boolean {
    const re = /^[a-z0-9]{6,12}$/
    return re.test(username)
}

export function isValidPassword(password: string): boolean {
    const re = /^(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[`~!@#$%^&*()\-_+=;:"'?.,<>[\]{}/\\|]*).{8,32}$/
    return re.test(password)
}
