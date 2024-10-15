const express = require('express')
const { authCheck, adminCheck } = require('../middleware/authCheck')
const { changeOrderStatus, getOrderAdmin } = require('../controller/admin')
const router = express.Router()

router.put('/admin/order-status', authCheck, adminCheck, changeOrderStatus)
router.get('/admin/orders', authCheck, adminCheck, getOrderAdmin)

module.exports = router