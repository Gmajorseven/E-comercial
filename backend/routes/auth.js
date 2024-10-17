const express = require('express')
const router = express.Router()
const { register, login, currentAdmin, currentUser } = require('../controller/auth')
const  { userCheck, adminCheck } = require('../middleware/authCheck')

router.use(express.json())

router.post('/register', register)
router.post('/login', login)
router.post('/current-admin',userCheck, adminCheck, currentAdmin)
router.post('/current-user', userCheck, currentUser)

module.exports = router
 