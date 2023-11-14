const { query } = require('../database/connection')
const bcrypt = require('bcrypt')

const postUser = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'All fields are requerid' })
    }

    try {
        const user = await query('select * from usuarios where email = $1', [email])
        if (user.rowCount > 0) {
            return res.status(400).json({ message: 'Emails already exists' })
        }

        const cryptPassword = await bcrypt.hash(senha, 10)

        const queryPost = 'insert into usuarios (nome, email, senha) values($1, $2, $3) returning *'
        const params = [nome, email, cryptPassword]
        const postedUser = await query(queryPost, params)

        if (postedUser.rowCount <= 0) {
            return res.status(500).json({ message: ` Server internal error: ${error.message}` })
        }

        const { senha: _, ...post } = postedUser.rows[0]

        return res.status(201).json({ message: `User created with sucess!` })

    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })
    }
}

const getUser = async (req, res) => {
    return res.json(req.usuario)
}

const updateUserProfile = async (req, res) => {
    const { usuario } = req
    const { nome, email, senha } = req.body
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'All fields are requerid' })
    }
    try {
        const user = await query('select * from usuarios where email = $1', [email])
        if (user.rowCount > 0 && user.rows[0].id !== usuario.id) {
            return res.status(400).json({ message: 'Email ja existe cadastrado' })
        }

        const cryptPassword = await bcrypt.hash(senha, 10)

        const queryPut = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4'
        const params = [nome, email, cryptPassword, usuario.id]
        const updatedUser = await query(queryPut, params)

        if (updatedUser.rowCount <= 0) {
            return res.status(500).json({ message: ` Server internal error: ${error.message}` })
        }
        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })
    }
}

module.exports = {
    postUser,
    getUser,
    updateUserProfile
}