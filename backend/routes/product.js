const express = require('express')
const router = express.Router()
const { create, list, remove, listby, searchFiters, update, read } = require('../controller/product')

router.post('/product', create)
router.get('/products/:count', list)
router.get('/product/:id', read)
router.delete('/product/:id', remove)
router.put('/product/:id', update)
router.post('/productby', listby)
router.post('/search/filters', searchFiters)

module.exports = router
