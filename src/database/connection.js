require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

const query = (text, param) => {
    return pool.query(text, param)
}

module.exports = {
    query
}