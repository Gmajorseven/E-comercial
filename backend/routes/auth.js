const express = require('express')
const router = express.Router()
const { register, login, currentAdmin, currentUser } = require('../controller/auth')

router.use(express.json())

router.post('/register', register)
router.post('/login', login)
router.post('/current-admin', currentAdmin)
router.post('/current-user', currentUser)

module.exports = router
 