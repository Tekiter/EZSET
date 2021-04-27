import express from 'express'
import { AccessInfo } from './auth'

export type Request = RequestWithUser
export type Response = express.Response
export type NextFunction = express.NextFunction

export interface RequestHandler {
    (req: Request, res: Response, next?: NextFunction): void
}

export interface Middleware {
    (req: Request, res: Response, next: NextFunction): void
}

interface RequestWithUser extends express.Request {
    user: AccessInfo
}
