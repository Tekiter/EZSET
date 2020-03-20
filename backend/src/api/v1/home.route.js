import { Router } from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import { getConfig, setConfig } from '../../utils/config'
// import { perm } from '../../utils/role'
import { body } from 'express-validator'

const router = Router()

/**
 * @api {get} /home/simple Simple 홈 화면
 * @apiDescription Simple 홈 화면의 내용을 가져옴
 * @apiName ViewSimpleHome
 * @apiGroup Home
 * @apiSuccess {Number} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {"content":"홈화면 내용"}
 */
router.get(
    '/simple',
    [],
    asyncRoute(async (req, res) => {
        const content = await getConfig('homeSimpleContent', '')
        res.json({ content })
    })
)

/**
 * @api {patch} /home/simple Simple 홈 화면 변경
 * @apiDescription Simple 홈 화면의 내용을 변경
 * @apiName EditSimpleHome
 * @apiGroup Home
 * @apiParam {String} content 바꿀 홈 화면의 내용
 * @apiParamExample {json} Request-Example:
 * {"content":"홈화면 내용"}
 */
router.patch(
    '/simple',
    [
        // perm('manageHome').can('update'),
        body('content').isString(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        await setConfig('homeSimpleContent', req.body.content)

        res.end()
    })
)

export default router
