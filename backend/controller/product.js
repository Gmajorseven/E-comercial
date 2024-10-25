const prisma = require('../config/prisma')
const cloudinary = require('cloudinary').v2 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

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
        const product = await prisma.products.findFirst({
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

        //delete pic
        const product = await prisma.products.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                images: true
            }
        })

        if(!product) {
            return res.status(400).json({ msg: 'Product not found!' })
        }

        const deleteImages = product.images.map((image) => 
        new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(image.public_id,(error, result) => {
                    error ? reject(error) : resolve(result)
                })
            })
        )

        await Promise.all(deleteImages)

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

exports.uploadImg = async(req, res) => {
    try {
        const { image } = req.body
        const result = await cloudinary.uploader.upload(image, {
            public_id: `${Date.now()}`,
            resource_type: 'auto',
            folder: 'ShopProductsPIC'
        })
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.deleteImg = async(req, res) => {
    try {
        const { public_id } = req.body

        await cloudinary.uploader.destroy(public_id, (result) => {
            res.status(200).json({ msg: 'Remove Image Successful!' })
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}