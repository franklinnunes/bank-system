const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'your_user',
    password: 'your_password',
    database: 'bank'
})

const query = (text, param) => {
    return pool.query(text, param)
}

module.exports = {
    query
}