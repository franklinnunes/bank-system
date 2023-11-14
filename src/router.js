const express = require('express')
const { postUser, getUser, updateUserProfile } = require('./controllers/users')
const { login } = require('./controllers/login')
const { authenticationFilter } = require('./middlewares/authentication')
const { getCategories } = require('./controllers/category')
const { getTransactions, detailTransaction, postTransaction, updateTransaction, deleteTransaction, getExtract } = require('./controllers/transaction')

const routes = express()

routes.post('/user', postUser)
routes.post('/login', login)

routes.use(authenticationFilter)

routes.get('/user', getUser)
routes.put('/user', updateUserProfile)

routes.get('/category', getCategories)

routes.get('/transaction', getTransactions)
routes.get('/transaction/extract', getExtract)
routes.get('/transaction/:id', detailTransaction)
routes.post('/transaction', postTransaction)
routes.put('/transaction/:id', updateTransaction)
routes.delete('/transaction/:id', deleteTransaction)


module.exports = routes