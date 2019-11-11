import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import config from '../utils/config'

const auth = {
    hashPassword(password) {
        return bcrypt.hashSync(password)
    },
    checkPassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    },
    createAccessToken({ username }) {
        return new Promise(function(resolve, reject) {
            jwt.sign(
                {
                    username,
                },
                process.env.JWT_SECRET,
                { expiresIn: 86400 },
                function(err, encoded) {
                    if (!err) {
                        resolve(encoded)
                    } else {
                        reject(err)
                    }
                }
            )
        })
    },
    checkToken(token) {
        return new Promise(function(resolve, reject) {
            jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
                if (!err) {
                    resolve(decoded)
                } else {
                    reject(err)
                }
            })
        })
    },
    async loginRequired(req, res, next) {
        if (req.headers && req.headers.authorization) {
            let tokenbase = req.headers.authorization.split(' ')
            if (tokenbase[0] === 'Bearer') {
                try {
                    const user = await auth.checkToken(tokenbase[1])
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
    },
    async superAdminRequired(req, res, next) {
        const f = () => {
            if (req.user.username === config.getConfig('superAdmin')) {
                next()
            } else {
                res.status(403).json({ message: '권한이 부족합니다.' })
            }
        }

        if (req.user) {
            f()
        } else {
            auth.loginRequired(req, res, f)
        }
    },
}

module.exports = auth

// export default auth
// export { auth }
