import Router from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import PenaltyConfig from '../../models/Penalty/PenaltyConfig'
import { perm } from '../../utils/role'
import { body } from 'express-validator'
const router = Router()

/**
 * @api {get} /penaltyconfig/read/ 상벌점 항목 조회
 * @apiDescription 사용자의 상벌점 항목 조회
 * @apiName penaltyconfigRead
 * @apiGroup PenaltyConfig
 * @apiPermission penalty.can.read
 *
 * @apiSuccess {Array} - 상벌점 항목을 배열로 반환
 * @apiSuccess {String} type 상벌점 항목의 이름
 * @apiSuccess {Number} value 상벌점 항목의 점수
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          [{
 *              type:"지각",
 *              date:"2020-03-19",
 *              description:"지각",
 *              point:-1
 *          }]
 *      }
 */
router.get(
    '/read', [perm('penalty').can('read')],
    asyncRoute(async function(req, res) {
        const cursor = await PenaltyConfig.find()
        res.json(cursor)
    })
)

/**
 * @api {post} /penaltyconfig/write/ 상벌점 항목 생성
 * @apiDescription 상벌점 항목 생성
 * @apiName penaltyconfigWrite
 * @apiGroup PenaltyConfig
 * @apiPermission penalty.can.update
 *
 * @apiParam {String} key 상벌점 항목 이름
 * @apiParam {String} value 상벌점 점수
 *
 * @apiParamExample {post} Request-Example:
 *      {
 *          key : "과제 지각",
 *          value : "-1"
 *      }
 *
 * @apiSuccess {200} code 기록 성공시 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 */
router.post(
    '/write', [
        perm('penalty').can('update'),
        body('key').isString(),
        body('value').isNumeric(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        const cnt = await PenaltyConfig.find()
            .where('key')
            .equals(req.body.key)
            .count()
        if (cnt > 0) return res.status(406).json()
        var penaltyConfig = new PenaltyConfig()
        penaltyConfig.key = req.body.key
        penaltyConfig.value = req.body.value
        penaltyConfig.save()
        res.end()
    })
)

/**
 * @api {post} /penaltyconfig/delete/ 상벌점 항목 삭제
 * @apiDescription 상벌점 항목 삭제
 * @apiName penaltyconfigDelete
 * @apiGroup PenaltyConfig
 * @apiPermission penalty.can.update
 *
 * @apiParam {String} key 상벌점 항목 이름
 *
 * @apiParamExample {post} Request-Example:
 *      {
 *          key : "과제 지각",
 *      }
 *
 * @apiSuccess {200} code 기록 성공시 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 */
router.post(
    '/delete', [perm('penalty').can('update'), body('key').isString(), validateParams],
    asyncRoute(async function(req, res) {
        if (req.body.key == '지각') {
            const err = new Error('지각 항목은 삭제할 수 없습니다.')
            err.status = 400
            throw err
        }
        if (req.body.key == '결석') {
            const err = new Error('결석 항목은 삭제할 수 없습니다.')
            err.status = 400
            throw err
        }
        await PenaltyConfig.findOneAndDelete({
            key: req.body.key,
        })
        res.end()
    })
)

/**
 * @api {post} /penaltyconfig/update/ 상벌점 항목 수정
 * @apiDescription 상벌점 항목의 점수 수정
 * @apiName penaltyconfigUpdate
 * @apiGroup PenaltyConfig
 * @apiPermission penalty.can.update
 *
 * @apiParam {String} key 상벌점 항목 이름
 *
 * @apiParamExample {post} Request-Example:
 *      {
 *          key : "과제 지각",
 *          value : -1
 *      }
 *
 * @apiSuccess {200} code 기록 성공시 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 */
router.post(
    '/update', [
        perm('penalty').can('update'),
        body('key').isString(),
        body('value').isNumeric(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        await PenaltyConfig.findOneAndUpdate({
            key: req.body.key,
        }, {
            value: req.body.value,
        })
        res.end()
    })
)
export default router