const { query } = require("../database/connection")

const getCategories = async (req, res) => {
    try {
        const categories = await query('select * from categorias')
        return res.json(categories.rows)
    } catch (error) {
        return res.status(500).json({ message: ` Server internal error: ${error.message}` })
    }
}

module.exports = {
    getCategories
}