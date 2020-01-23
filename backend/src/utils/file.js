/*
file.js
파일 업로드와 다운로드를 관리하는 모듈

*/

import fs from 'fs'
import path from 'path'
import multer from 'multer'
import File from '../models/File'

// 파일이 저장될 디렉토리를 지정
const uploadDir = process.env.FILE_UPLOAD_DIR || path.join(__dirname, 'upload')

// 업로드 폴더가 없을 시, 생성한다.
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
    }
} catch (error) {
    console.log('Could not create file upload folder: ' + uploadDir) // eslint-disable-line no-console
}

// multer 디스크스토리지 생성
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir)
    },
    filename(req, file, cb) {
        // DB에 파일 정보를 생성하고, 생성된 Document의 ID를 파일 명으로 한다.
        const fileobj = new File({
            filename: file.originalname,
        })
        fileobj.save().then(res => {
            cb(null, fileobj.id)
        })
    },
})

// 파일 업로드 multer 미들웨어
// 파일 외부에서의 직접 접근을 막는다.
const rawUpload = multer({ storage })

// 업로드된 파일의 정보를 db에 업데이트 하기위한 미들웨어
export const upload = {
    single(field) {
        return (req, res, next) => {
            const middle = rawUpload.single(field)

            // 파일이 업로드 된 이후에 DB정보 업데이트
            const afterUpload = () => {
                if (!req.file) {
                    res.status(400).json({ error: 'Invalid file upload' })
                    return
                }

                File.findById(req.file.filename).then(file => {
                    file.size = req.file.size
                    file.uploader = req.user.username
                    file.mimetype = req.file.mimetype
                    file.save().then(() => {
                        next()
                    })
                })
            }

            if (req.user) {
                // 파일 업로드 미들웨어 실행
                middle(req, res, afterUpload)
            } else {
                res.status(401).json({ message: '로그인이 필요합니다.' })
            }
        }
    },
}

/**
 * 파일 ID를 기준으로 파일의 정보를 가져온다.
 * @param {ObjectID} file_id
 */
export async function getFileInfo(file_id) {
    const file = await File.findById(file_id).cache()

    if (!file) {
        return undefined
    }

    return {
        filename: file.filename,
        size: file.size,
        uploader: file.uploader,
        timestamp: file.timestamp,
    }
}

export function getFilePath(file_id) {
    return path.join(uploadDir, file_id)
}

export async function increaseFileHit(file_id) {
    const file = await File.findById(file_id).cache()
    await file.increaseHit()
}
