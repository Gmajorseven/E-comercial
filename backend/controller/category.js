const prisma = require('../config/prisma')

exports.create = async(req, res) => {
    try {
        const { name } = req.body

        const checkName = await prisma.categories.findFirst({
            where: {
                name: name
            }
        })

        if(checkName) {
            return res.status(400).json({ msg: `${name} is already exits!` })
        }

        await prisma.categories.create({
            data: {
                name: name
            }
        })
        res.status(200).json({ msg: `${name} has created!` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.list = async(req, res) => {
    try {
        const categories = await prisma.categories.findMany()
        res.status(200).send(categories)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.remove = async(req, res) => {
    try {
        const { id } = req.params
        await prisma.categories.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).json({ msg: 'Delete successful' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}
