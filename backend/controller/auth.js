const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    try {
        const { email, password } = req.body

        if(!email) {
            return res.status(400).json({ msg: 'Email is require!' })
        }

        if(!password) {
            return res.status(400).json({ msg: 'Password is require!' })
        }

        const user = await prisma.users.findFirst({
            where: {
                email:email
            }
        })
        
        if(user) {
            return res.status(400).json({ msg: 'Email already exits!' })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        
        await prisma.users.create({
            data: {
                email: email,
                password: hashPassword
            }
        })

        console.log(email)
        res.status(200).send(user)        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })        
    }
}

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body

        const user = await prisma.users.findFirst({
            where: {
                email: email
            }
        })
        if(!user || !user.enable) {
            if (!user) {
                return res.status(400).json({ msg: 'User not fonud!' })
            }
            if (!user.enable) {
                return res.status(400).json({ msg: 'User banded!' })
            }
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(500).json({ msg: 'Password invalid' })
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        jwt.sign(payload, process.env.SECRET, {expiresIn: '1d'}, (error, token) => {
            if(error) {
                return res.status(500).json({ msg: 'Server is error' })
            }
            res.json({ payload, token })
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })        
    }
}

exports.currentUser = (req, res) => {
    try {
        res.send("Hello, user")                
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })        
    }
}

exports.currentAdmin = (req, res) => {
    try {
        res.send("Hello, admin")
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })        
    }
}