import express from 'express'
import {
    Request as OriginalRequest,
    Response as OriginalResponse,
    NextFunction as OriginalNextFunction,
    Query,
} from 'express-serve-static-core'
import { AccessInfo } from './auth'

export type Request = OriginalRequest
export type Response = OriginalResponse
export type NextFunction = OriginalNextFunction

export interface RequestHandler<
    Request extends OriginalRequest = RequestWithAuth
> {
    (req: Request, res: Response, next?: NextFunction): void | Promise<void>
}

export interface Middleware<Request extends OriginalRequest = RequestWithAuth> {
    (req: Request, res: Response, next: NextFunction): void | Promise<void>
}

export interface ParamsDictionary {
    [key: string]: string
}
export interface RequestWithAuth<
    TBody = unknown,
    TParams = ParamsDictionary,
    TQuery = Query
> extends OriginalRequest<TParams, unknown, TBody, TQuery> {
    user: AccessInfo
}

export type RequestWithoutAuth = OriginalRequest

export interface APIRouter extends express.Router {
    loginNotRequired: boolean
}
