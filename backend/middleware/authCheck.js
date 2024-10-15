const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

exports.authCheck = async(req, res, next) => {
    try {
        const headerToken = req.headers.authorization

        if(!headerToken) {
            return res.status(401).json({ msg: 'No Token, Authorization' })
        }
        const token = headerToken.split(" ")[1]

        const decode = jwt.verify(token, process.env.SECRET)
        req.user = decode

        const user = await prisma.users.findFirst({
            where: {
                email: req.user.email
            }
        })

        if(!user.enable) {
            return res.status(400).json({ msg: 'Account has banded' })
        }
 
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Token Invalid' })
    }
}

exports.adminCheck = async(req, res, next) => {
    try {
        const { email } = req.user
        
        const adminUser = await prisma.users.findFirst({
            where: {
                email: email
            }
        })

        if(!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied, Admin only' })
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Error, Admin access denied' })
    }
}