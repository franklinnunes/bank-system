const { query } = require('../database/connection')
const jwt = require('jsonwebtoken')

const authenticationFilter = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ message: 'Not authorized' })
    }
    try {
        const token = authorization.replace('Bearer ', '').trim()
        const { id } = jwt.verify(token, 'securePass')
        const { rows, rowCount } = await query('select * from usuarios where id = $1', [id])
        if (rowCount <= 0) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        const [usuario] = rows
        const { senha: _, ...userData } = usuario

        req.usuario = userData
        next()
    } catch (error) {
        return res.status(500).json({ message: `Server internal error: ${error.message}` })
    }
}

module.exports = { authenticationFilter }