const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { query } = require('../database/connection')

const login = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email and password are required' })
    }
    try {
        const { rows, rowCount } = await query('select * from usuarios where email = $1', [email])
        if (rowCount <= 0) {
            return res.status(400).json({ message: 'email ou senha incorretas' })
        }

        const [usuario] = rows    // const usuario = rows[0]
        const correctPassword = await bcrypt.compare(senha, usuario.senha)
        if (!correctPassword) {
            return res.status(400).json({ message: 'Email ou senha incorretos' })
        }
        const token = jwt.sign({ id: usuario.id }, 'securePass', { expiresIn: '30d' })
        const { senha: _, ...userData } = usuario

        return res.status(200).json({
            usuario: userData,
            token
        })
    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })

    }
}

module.exports = {
    login
}