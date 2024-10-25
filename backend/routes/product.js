const express = require('express')
const router = express.Router()
const { create, list, remove, listby, searchFiters, update, read, uploadImg, deleteImg } = require('../controller/product')
const { userCheck, adminCheck } = require('../middleware/authCheck')

router.post('/product', userCheck, adminCheck, create)
router.get('/products/:count', userCheck, list)
router.get('/product/:id', userCheck, read)
router.delete('/product/:id', userCheck, adminCheck, remove)
router.put('/product/:id', userCheck, adminCheck, update)
router.post('/productby', userCheck, listby)
router.post('/search/filters', userCheck, searchFiters)
router.post('/images', userCheck, adminCheck, uploadImg)
router.post('/removeimages', userCheck, adminCheck, deleteImg)

module.exports = router
