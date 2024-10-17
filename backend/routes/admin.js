const express = require('express')
const { userCheck, adminCheck } = require('../middleware/authCheck')
const { changeOrderStatus, getOrderAdmin } = require('../controller/admin')
const router = express.Router()

router.put('/admin/order-status', userCheck, adminCheck, changeOrderStatus)
router.get('/admin/orders', userCheck, adminCheck, getOrderAdmin)

module.exports = router