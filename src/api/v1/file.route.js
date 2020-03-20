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

// 업로드 된 파일의 정보 획득
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

// 파일을 업로드
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

// 파일을 다운로드
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

router.post(
    '/manage/cleanup',
    [perm('manageServer').can('access'), validateParams],
    asyncRoute(async (req, res) => {
        await cleanupUnlinkedFiles()
        res.status(200).end()
    })
)
export default router
