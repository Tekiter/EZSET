/* eslint-disable no-console */
import { validationResult } from 'express-validator'
import role from './role'
import User from '../models/User'
import {
    Middleware,
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'src/types'

type AsyncRouteFunction = (
    fn: (
        ...args: Parameters<RequestHandler>
    ) => Promise<ReturnType<RequestHandler>>
) => (...args: Parameters<Middleware>) => void

export const asyncRoute: AsyncRouteFunction = fn => (...args) =>
    fn(...args).catch(args[2])

export function validateParams(
    req: Request,
    res: Response,
    next: NextFunction
): boolean {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return false
    } else {
        if (next) {
            next()
        }
        return true
    }
}

/**
 * 유저의 아이디가 존재하는지 검사하는 함수
 * @example param('username').custom(checkUsername)
 */
export async function checkUsername(value: string): Promise<boolean> {
    const user = await User.findOne()
        .where('username')
        .equals(value)
    if (user) {
        return true
    } else {
        throw new Error('존재하지 않는 아이디입니다.')
    }
}

/**
 * RoleTag 가 존재하는지 검사하는 함수
 * @example param('username').custom(checkRoleTag)
 */
export async function checkRoleTag(value: string): Promise<boolean> {
    if (role.roles.hasRole(value)) {
        return true
    } else {
        throw new Error('존재하지 않는 Role Tag 입니다.')
    }
}

/**
 * RoleTag 들의 배열이 올바른지 검사하는 함수
 * @example param('username').custom(checkRoleTagArray)
 */
export async function checkRoleTagArray(value: string): Promise<boolean> {
    if (!Array.isArray(value)) {
        throw new Error('올바르지 않은 Role 배열입니다.')
    }
    for (const roletag of value) {
        await checkRoleTag(roletag)
    }
    return true
}

/**
 * RoleTag 가 존재하는지 검사하는 함수
 * @example param('username').custom(checkRoleTag)
 */
export function isPositive(value: unknown): boolean {
    const intval = parseInt(value + '')
    if (intval) {
        return intval >= 0
    }
    return false
}