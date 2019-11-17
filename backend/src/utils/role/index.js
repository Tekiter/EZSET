const role = {
    async getPermission(req, res, next) {
        if (req.user) {
            next()
        } else {
            next()
        }
    },
}

module.exports = role
