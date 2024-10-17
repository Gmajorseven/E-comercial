const express = require('express')
const { listUsers, changeStatus, changeRole,
    addUserCart, listUserCart, removeUserCart,
    saveAddress, saveOrder, listOrder } = require('../controller/user')
const { userCheck, adminCheck } = require('../middleware/authCheck')
const router = express.Router()

router.get('/users', userCheck, adminCheck, listUsers)
router.post('/change-status', userCheck, adminCheck, changeStatus)
router.post('/change-role', userCheck, adminCheck, changeRole)

router.post('/user/cart', userCheck, addUserCart)
router.get('/user/cart', userCheck, listUserCart)
router.delete('/user/cart', userCheck, removeUserCart)

router.post('/user/address', userCheck, saveAddress)

router.post('/user/order', userCheck, saveOrder)
router.get('/user/order', userCheck, listOrder)

module.exports = router