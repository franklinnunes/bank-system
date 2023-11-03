const { query } = require("../database/connection")

const getTransactions = async (req, res) => {
    const { usuario } = req
    const { filtro } = req.query
    if (filtro && !Array.isArray(filtro)) {
        return res.status(404).json({ message: 'Filter needs be an array' })
    }
    try {
        let queryLike = ''
        let arrayFilter
        if (filtro) {
            arrayFilter = filtro.map((item) => `%${item}%`)
            queryLike += `and c.descricao ilike any($2)`
        }
        const queryTransactions = `
        select t.*, c.descricao as categoria_nome from transacoes t
        left join categorias c
        on t.categoria_id = c.id
        where t.usuario_id = $1
        ${queryLike}
        `;
        const paramsFilter = filtro ? [usuario.id, arrayFilter] : [usuario.id]
        const transactions = await query(queryTransactions, paramsFilter)
        return res.json(transactions.rows)
    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })
    }
}

const detailTransaction = async (req, res) => {
    const { usuario } = req
    const { id } = req.params
    try {
        const { rowCount, rows } = await query('select * from transacoes where usuario_id = $1 and id = $2', [usuario.id, id])
        if (rowCount <= 0) {
            return res.status(404).json({ message: 'Transaction not found.' })
        }
        const [transaction] = rows
        return res.json(transaction)
    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })
    }
}

const postTransaction = async (req, res) => {
    const { usuario } = req
    const { descricao, valor, data, categoria_id, tipo } = req.body
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ message: 'Type needs be: "entrada" or "saida"' })

    }
    try {
        const category = await query('select * from categorias where id = $1', [categoria_id])
        if (category.rowCount <= 0) {
            return res.status(404).json({ message: 'Transaction not found.' })
        }
        const queryPost = `insert into transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) 
        values ($1, $2,  $3, $4, $5, $6) returning *`;
        const paramsPost = [descricao, valor, data, categoria_id, tipo, usuario.id]
        const { rowCount, rows } = await query(queryPost, paramsPost)
        if (rowCount <= 0) {
            return res.status(500).json({ message: ` Server internal error: ${error.message}` })
        }
        const [transacao] = rows
        transacao.categoria_nome = category.rows[0].descricao
        return res.status(201).json(transacao)
    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })
    }
}

const updateTransaction = async (req, res) => {
    const { usuario } = req
    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ message: 'Type needs be: "entrada" or "saida"' })

    }
    try {
        const transaction = await query('select * from transacoes where usuario_id = $1 and id = $2', [usuario.id, id])
        if (transaction.rowCount <= 0) {
            return res.status(404).json({ message: 'Transaction not found.' })
        }
        const category = await query('select * from categorias where id = $1', [categoria_id])
        if (category.rowCount <= 0) {
            return res.status(404).json({ message: 'Transaction not found.' })
        }
        const updateQuery = 'update transacoes set descricao = $1, valor = $2, data= $3, categoria_id = $4, tipo = $5 where id = $6';
        const updateParams = [descricao, valor, data, categoria_id, tipo, id]
        const updatedTransaction = await query(updateQuery, updateParams)
        if (updatedTransaction.rowCount <= 0) {
            return res.status(500).json({ message: ` Server internal error: ${error.message}` })
        }
        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })
    }
}

const deleteTransaction = async (req, res) => {
    const { usuario } = req
    const { id } = req.params
    try {
        const transaction = await query('select * from transacoes where usuario_id = $1 and id = $2', [usuario.id, id])
        if (transaction.rowCount <= 0) {
            return res.status(404).json({ message: 'Transaction not found.' })
        }
        const deletedTransaction = await query('delete from transacoes where id = $1', [id])
        if (deletedTransaction.rowCount <= 0) {
            return res.status(500).json({ message: ` Server internal error: ${error.message}` })
        }
        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })
    }
}

const getExtract = async (req, res) => {
    const { usuario } = req
    try {
        const queryExtract = 'select sum(valor) as saldo from transacoes where usuario_id = $1 and tipo = $2'
        const inBalance = await query(queryExtract, [usuario.id, 'entrada'])
        const outBalance = await query(queryExtract, [usuario.id, 'saida'])

        return res.json({
            entrada: Number(inBalance.rows[0].saldo) ?? 0,
            saida: Number(outBalance.rows[0].saldo) ?? 0
        })
    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })
    }
}

module.exports = {
    getTransactions,
    detailTransaction,
    postTransaction,
    updateTransaction,
    deleteTransaction,
    getExtract
}