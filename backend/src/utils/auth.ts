import { Response, NextFunction } from 'express'
import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import { getConfig } from './config'
import { AccessInfo, StrictAccessInfo, RequestWithAuth } from '../types'

function getJWTSecret(): string {
    const JWT_SECRET = process.env.JWT_SECRET

    if (JWT_SECRET === undefined) {
        throw new Error('JWT_SECRET is not set')
    }

    return JWT_SECRET + ''
}

function checkAccessInfo(raw: Partial<AccessInfo>): raw is AccessInfo {
    if (!('username' in raw)) {
        return false
    }
    if (!('roles' in raw)) {
        return false
    }
    return true
}

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password)
}

export function checkPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
}

export function createAccessToken({
    username,
    roles,
}: AccessInfo): Promise<string> {
    return new Promise(function(resolve, reject) {
        jwt.sign(
            {
                username,
                roles,
            },
            getJWTSecret(),
            { expiresIn: 86400 },
            function(err, encoded) {
                if (!err && encoded !== undefined) {
                    resolve(encoded)
                } else {
                    reject(err)
                }
            }
        )
    })
}

//accessToken이 유효한지 확인
export function checkToken(token: string): Promise<AccessInfo> {
    return new Promise(function(resolve, reject) {
        jwt.verify(token, getJWTSecret(), function(err, decoded) {
            if (!err && decoded !== undefined) {
                if (checkAccessInfo(decoded)) {
                    resolve(decoded)
                } else {
                    reject({})
                }
            } else {
                reject(err)
            }
        })
    })
}

//민감한 개인정보를 수정,관리하기 위한 토큰
export function createEditToken(username: string): Promise<string> {
    return new Promise(function(resolve, reject) {
        jwt.sign(
            {
                username,
                is_edit_token: true,
            } as StrictAccessInfo,
            getJWTSecret(),
            { expiresIn: 300 },
            function(err, encoded) {
                if (!err && encoded) {
                    resolve(encoded)
                } else {
                    reject(err)
                }
            }
        )
    })
}

export async function loginRequired(
    req: RequestWithAuth,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (req.headers && req.headers.authorization) {
        const tokenbase = req.headers.authorization.split(' ')
        if (tokenbase[0] === 'Bearer') {
            try {
                const user = await checkToken(tokenbase[1])
                req.user = user
                next()
                return
            } catch (error) {
                res.status(401).json({ message: '로그인이 필요합니다.' })
                return
            }
        }
    }
    res.status(401).json({ message: '로그인이 필요합니다.' })
}

export async function superAdminRequired(
    req: RequestWithAuth,
    res: Response,
    next: NextFunction
): Promise<void> {
    const f = async () => {
        if (req.user.username === (await getConfig('superAdmin'))) {
            next()
        } else {
            res.status(403).json({ message: '권한이 부족합니다.' })
        }
    }

    if (req.user) {
        await f()
    } else {
        loginRequired(req, res, f)
    }
}
