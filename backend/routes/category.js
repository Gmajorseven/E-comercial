const express = require('express')
const router = express.Router()
const { create, list, remove } = require('../controller/category')
const { userCheck, adminCheck } = require('../middleware/authCheck')

router.get('/category', userCheck, adminCheck, list)
router.post('/category', userCheck, adminCheck, create)
router.delete('/category/:id', userCheck, adminCheck, remove)

module.exports = router
 