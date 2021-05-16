/*
file.ts
파일 업로드와 다운로드를 관리하는 모듈

*/

import fs from 'fs'
import path from 'path'
import multer from 'multer'
import File, { FileDocument } from '../models/File'
import {
    FileInfo,
    FileXRef,
    NextFunction,
    Response,
    RequestWithAuth,
} from 'src/types'

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
        fileobj.save().then(() => {
            cb(null, fileobj.id)
        })
    },
})

// 파일 업로드 multer 미들웨어
// 파일 외부에서의 직접 접근을 막는다.
const rawUpload = multer({ storage })

// 업로드된 파일의 정보를 db에 업데이트 하기위한 미들웨어
export const upload = {
    single(
        field: string
    ): (req: RequestWithAuth, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            const middle = rawUpload.single(field)

            // 파일이 업로드 된 이후에 DB정보 업데이트
            const afterUpload = () => {
                if (!req.file) {
                    res.status(400).json({ error: 'Invalid file upload' })
                    return
                }

                File.findById(req.file.filename).then(file => {
                    if (file === null) {
                        throw new Error('File document not exists.')
                    }
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

export async function getFileById(id: string): Promise<FileDocument> {
    const file = await File.findById(id)
    if (file === null) {
        throw new Error('File record not found in db')
    }
    return file
}

/**
 * 파일 ID를 기준으로 파일의 정보를 가져온다.
 * @param {ObjectID} file_id
 */
export async function getFileInfo(
    file_id: string
): Promise<FileInfo | undefined> {
    const file = await File.findById(file_id) /*.cache()*/

    if (!file) {
        return undefined
    }

    return {
        id: file_id,
        filename: file.filename,
        size: file.size,
        uploader: file.uploader,
        timestamp: file.timestamp,
    }
}

export async function getFileInfoArray(files: string[]): Promise<FileInfo[]> {
    const output: FileInfo[] = []
    for (const file of files) {
        const fileinfo = await getFileInfo(file)
        if (fileinfo === undefined) {
            continue
        }
        output.push(fileinfo)
    }
    return output
}

/**
 * 파일의 ID를 기준으로 실제 파일 경로를 가져온다.
 * @param {ObjectID} file_id
 */
export function getFilePath(file_id: string): string {
    return path.join(uploadDir, file_id)
}

/**
 * 파일 다운로드 횟수를 1 증가시킨다.
 * @param {ObjectID} file_id
 */
export async function increaseFileHit(file_id: string): Promise<void> {
    const file = await File.findById(file_id) /*.cache()*/
    if (file) {
        await file.increaseHit()
    }
}

function hasLink(
    fileDocument: FileDocument
): fileDocument is FileDocument & Pick<Required<FileDocument>, 'link'> {
    if (fileDocument.link && fileDocument.link.target) {
        return true
    }
    return false
}

export function setUploadExpireTimeout(fileId: string, timeout: number): void {
    setTimeout(async () => {
        const file = await File.findById(fileId)

        if (file && !hasLink(file)) {
            await deleteFile(fileId)
        }
    }, timeout)
}

/**
 * 첨부가 가능한, 즉 역참조가 없는 파일인지 체크
 * @param {*} fileId 파일의 ID
 */
export async function checkAttachableFile(fileId: string): Promise<boolean> {
    // let file
    try {
        await File.findById(fileId + '')
    } catch (error) {
        throw new Error('올바르지 않은 파일 ID 입니다.')
    }

    // if (file.hasLink()) {
    //     throw new Error('이미 첨부된 파일입니다.')
    // }

    return true
}

/**
 * 첨부가 가능한 파일 ID의 배열인지 체크
 * @param {*} files 파일 ID들이 들어있는 배열
 */
export async function checkAttachableFileArray(
    files: string[]
): Promise<boolean> {
    if (!Array.isArray(files)) {
        throw new Error('올바르지 않은 파일 ID 배열입니다.')
    }

    for (const fileId of files) {
        await checkAttachableFile(fileId)
    }
    return true
}

/**
 * 파일 오브젝트에 역참조를 등록한다.
 * @param {*} files
 * @param {*} target
 * @param {*} ref
 */
export async function applyFileLink(
    files: string[],
    target: string,
    ref: string
): Promise<void> {
    if (!Array.isArray(files)) {
        files = [files]
    }
    for (const fileId of files) {
        const file = await File.findById(fileId)

        if (!file) {
            continue
        }

        file.link = {
            target,
            ref,
        }

        file.markModified('link')

        await file.save()
    }
}

/**
 * 파일 오브젝트에 역참조를 제거한다.
 */
export async function removeFileLink(files: string[]): Promise<void> {
    if (!Array.isArray(files)) {
        files = [files]
    }
    for (const fileId of files) {
        const file = await getFileById(fileId)

        file.link = undefined

        file.markModified('link')

        await file.save()
    }
}

/**
 * 역참조가 없는 파일을 삭제한다.
 * @param {*} files
 */
export async function deleteUnlinkedFile(files: string[]): Promise<void> {
    if (!Array.isArray(files)) {
        files = [files]
    }
    for (const fileId of files) {
        const file = await File.findById(fileId)

        if (file && !hasLink(file)) {
            await deleteFile(fileId)
        }
    }
}

export async function cleanupUnlinkedFiles(): Promise<void> {
    const allFiles = await File.find()
    await deleteUnlinkedFile(
        allFiles.map(file => {
            return file.id
        })
    )
}

/**
 * 해당 파일을 삭제한다.
 * @param {*} fileId
 */
export async function deleteFile(fileId: string): Promise<void> {
    try {
        const file = await getFileById(fileId)
        try {
            await fs.promises.unlink(path.join(uploadDir, file.id))
        } catch (error) {
            //
        }

        await file.remove()
    } catch (error) {}
}

/**
 * 파일들이 모두 특정 유저가 올린 것인지 확인한다.
 * @param {*} files 파일 ID 또는 파일 ID의 배열
 * @param {*} username 판단할 유저
 */
export async function checkIsFileOwner(
    files: string[],
    username: string
): Promise<boolean> {
    if (!Array.isArray(files)) {
        files = [files]
    }
    for (const fileId of files) {
        const file = await getFileById(fileId)
        if (file.uploader !== username) {
            return false
        }
    }
    return true
}

/**
 * 파일들이 모두 역참조가 존재하지 않는지 확인한다.
 * @param {*} files
 */
export async function checkUnlinkedFile(files: string[]): Promise<boolean> {
    if (!Array.isArray(files)) {
        files = [files]
    }
    for (const fileId of files) {
        const file = await getFileById(fileId)
        if (hasLink(file)) {
            return false
        }
    }
    return true
}

export async function getFileLinks(files: string[]): Promise<FileXRef[]> {
    if (!Array.isArray(files)) {
        files = [files]
    }
    const res: FileXRef[] = []
    for (const fileId of files) {
        const file = await getFileById(fileId)
        if (hasLink(file)) {
            res.push({
                target: file.link.target,
                ref: file.link.ref,
            })
        }
    }
    return res
}
