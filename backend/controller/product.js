const prisma = require('../config/prisma')

exports.create = async(req, res) => {
    try {
        const { title, description, price, quantity, categoryId, images } = req.body    
        
        const products = await prisma.products.create({
            data: {
            title: title, description: description, price: parseFloat(price),
            quantity: parseInt(quantity), categoryId: parseInt(categoryId), images: {
                create: images.map((i) => ({
                    asset_id: i.asset_id,
                    public_id: i.public_id,
                    url: i.url,
                    secure_url: i.secure_url
                    }))
                }
            }
        })
        res.status(200).send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.list = async(req, res) => {
    try {
        const { count } = req.params
        const products = await prisma.products.findMany({
            take: parseInt(count),
            orderBy: { cretedAt: 'asc'},
            include: {
                category: true,
                images: true
            }
        })
        res.status(200).send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.read = async(req, res) => {
    try {
        const { id } = req.params
        const product = await prisma.products.findMany({
            where: {
                id: Number(id)
            }, 
            include: {
                category: true,
                images: true
            }
        })
        res.status(200).send(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.remove = async(req, res) => {
    try {
        const { id } = req.params
        await prisma.products.delete({
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

exports.update = async(req, res) => {
    try {
        const { title, description, price, quantity, categoryId, images } = req.body
        const { id } = req.params
        
        await prisma.images.deleteMany({
            where: {
                productId: Number(id)
            }
        })
        
        const product = await prisma.products.update({
            where: {
                id: Number(id)
            },
            data: {
            title: title, description: description, price: parseFloat(price),
            quantity: parseInt(quantity), categoryId: parseInt(categoryId), images: {
                create: images.map((i) => ({
                    asset_id: i.asset_id,
                    public_id: i.public_id,
                    url: i.url,
                    secure_url: i.secure_url
                    }))
                }
            }
        })
        res.status(200).send(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.listby = async(req, res) => {
    try {
        const { sort, order, limit } = req.body
        console.log(sort, order, limit)
        const products = await prisma.products.findMany({
            take: Number(limit),
            orderBy: { [sort]: order }, 
            include: { category: true }
        })

        res.status(200).send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

const handleQuery = async(req, res, query) => {
    try {
        const products = await prisma.products.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.status(200).send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Search error' })
    }
}

const handlePrice = async(req, res, priceRange) => {
    try {
        const products = await prisma.products.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.status(200).send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Search error' })
    }
}

const handleCategory = async(req, res, categoryId) => {
    try {
        const products = await prisma.products.findMany({
            where: {
                categoryId: {
                    in: categoryId.map((id) => Number(id))
                }
            }, include: {
                category: true, 
                images: true
            }
        })
        res.status(200).send(products)

    } catch (error) {
        console.log(error)
        res.status.json({ msg: 'Search error' })
    }
}

exports.searchFiters = async(req, res) => {
    try {
        const { query, category, price } = req.body
        if(query) {
            console.log('query -->', query)
            await handleQuery(req, res, query)
        }
        if(category) {
            console.log('category -->', category)
            await handleCategory(req, res, category)
        }
        if(price) {
            console.log('price -->', price)
            await handlePrice(req, res, price)
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}