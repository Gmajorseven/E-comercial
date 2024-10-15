const express = require('express')
const { listUsers, changeStatus, changeRole,
    addUserCart, listUserCart, removeUserCart,
    saveAddress, saveOrder, listOrder } = require('../controller/user')
const { authCheck, adminCheck } = require('../middleware/authCheck')
const router = express.Router()

router.get('/users', authCheck, adminCheck, listUsers)
router.post('/change-status', authCheck, adminCheck, changeStatus)
router.post('/change-role', authCheck, adminCheck, changeRole)

router.post('/user/cart', authCheck, addUserCart)
router.get('/user/cart', authCheck, listUserCart)
router.delete('/user/cart', authCheck, removeUserCart)

router.post('/user/address', authCheck, saveAddress)

router.post('/user/order', authCheck, saveOrder)
router.get('/user/order', authCheck, listOrder)

module.exports = router