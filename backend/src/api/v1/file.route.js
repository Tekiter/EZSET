/*
file.route.js
파일 업로드와 다운로드를 관리하는 Route

*/

import { Router } from 'express'
import {
    upload,
    getFileInfo,
    getFilePath,
    increaseFileHit,
    setUploadExpireTimeout,
    cleanupUnlinkedFiles,
} from '../../utils/file'
import { asyncRoute, validateParams } from '../../utils/api'
import { param } from 'express-validator'
import { perm } from '../../utils/role'

const router = Router()

/**
 * @api {get} /file/info/:file_id 업로드된 파일 정보
 * @apiDescription 업로드된 파일에 대한 기본 정보를 가져옴
 * @apiName FileInfo
 * @apiGroup File
 * @apiParam {String} file_id 파일의 id
 * @apiSuccess {String} id 파일의 id
 * @apiSuccess {String} filename 파일의 이름
 * @apiSuccess {Number} size 파일의 크기
 * @apiSuccess {String} uploader 파일을 올린 유저의 아이디
 * @apiSuccess {Datetime} timestamp 파일을 올린 시간
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "id": "5e2c0c86850bef7560bfa898",
 *        "filename": "1.PNG",
 *        "size": 34850,
 *        "uploader": "helloworld",
 *        "timestamp": "2020-01-25T09:38:14.533Z"
 *      }
 */
router.get(
    '/info/:file_id',
    [param('file_id').isMongoId(), validateParams],
    asyncRoute(async (req, res) => {
        const fileinfo = await getFileInfo(req.params.file_id)
        if (fileinfo) {
            res.json(fileinfo)
        } else {
            // await deleteFile(req.params.file_id)
            const err = new Error('존재하지 않는 파일입니다.')
            err.status = 404
            throw err
        }
    })
)

/**
 * @api {post}} /file/upload 파일 업로드
 * @apiDescription 파일을 서버에 업로드한다.
 * @apiName UploadFile
 * @apiGroup File
 * @apiParam {File} file 파일의 이진 데이터
 * @apiSuccess {String} id 업로드된 파일의 id
 * @apiSuccess {Number} size 업로드된 파일의 크기
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "id":"5e7480be9c20a25c88590aab",
 *        "size":34850
 *      }
 */
router.post(
    '/upload',
    upload.single('file'),
    asyncRoute(async (req, res) => {
        // 업로드 이후 5분동안 첨부가 없으면, 파일을 자동 삭제한다.
        setUploadExpireTimeout(req.file.filename, 300000)

        res.json({
            id: req.file.filename,
            size: req.file.size,
        })
    })
)

/**
 * @api {get} /file/download/:file_id 파일 다운로드
 * @apiDescription 업로드된 파일을 다운로드한다. 요청시 파일의 이진 데이터가 결과로 전송된다.
 * @apiName DownloadFile
 * @apiGroup File
 * @apiParam {String} file_id 파일의 id
 */
router.get(
    '/download/:file_id',
    [param('file_id').isMongoId(), validateParams],
    asyncRoute(async (req, res) => {
        const fileinfo = await getFileInfo(req.params.file_id)
        if (fileinfo) {
            const fullpath = getFilePath(req.params.file_id)
            res.download(fullpath, fileinfo.filename, async err => {
                if (err) {
                    res.status(404).json({
                        message: '삭제된 파일입니다.',
                    })
                } else {
                    await increaseFileHit(req.params.file_id)
                }
            })
        } else {
            res.status(404).json({ message: '존재하지 않는 파일입니다.' })
        }
    })
)

/**
 * @api {get} /file/manage/cleanup 파일 폴더 정리
 * @apiDescription 사용되지 않지만, 디스크에 남아있는 파일을 삭제하여 용량을 확보한다.
 * @apiName CleanupFiles
 * @apiGroup File
 */
router.post(
    '/manage/cleanup',
    [perm('manageServer').can('access'), validateParams],
    asyncRoute(async (req, res) => {
        await cleanupUnlinkedFiles()
        res.status(200).end()
    })
)
export default router
