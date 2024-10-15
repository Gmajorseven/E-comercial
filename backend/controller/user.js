const prisma = require('../config/prisma')

exports.listUsers = async(req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                enable: true,
                address: true
            }
        })

        res.status(200).send(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.changeStatus = async(req, res) => {
    try {
        const { id, enable } = req.body
        
        await prisma.users.update({
            where: {
                id: Number(id)
            }, 
            data: {
                enable: enable
            }
        })

        res.status(200).json({ msg: 'Update status success!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.changeRole = async(req, res) => {
    try {
        const { id, role } = req.body
        
        await prisma.users.update({
            where: {
                id: Number(id)
            }, 
            data: {
                role: role
            }
        })

        res.status(200).json({ msg: 'Update role success!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.addUserCart = async(req, res) => {
    try {
        const { cart } = req.body
        const { id } = req.user
        
        await prisma.productsOnCarts.deleteMany({
            where: {
                cart: { orderById: Number(id) }
            }
        })

        await prisma.carts.deleteMany({
            where: { orderById: Number(id) }
        })
        
        let products = cart.map((items) => ({
            productId: items.id,
            count: items.count,
            price: items.price
        }))

        let cartTotal = products.reduce((sum, item) => sum+item.price * item.count, 0)

        const newCart = await prisma.carts.create({
            data: {
                products: { create: products },
                cartTotal: cartTotal,
                orderById: Number(id)
            }
        })

        console.log(newCart)
        res.status(200).json({ msg: 'Add products to cart successful!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.listUserCart = async(req, res) => {
    try {
        const { id } = req.user
        const cart = await prisma.carts.findFirst({
            where: {
                orderById: Number(id)
            },
            include: {
                products: {
                    include: {
                        product: true,
                    }
                }
            }
        })

        if(!cart) {
            return res.status(400).json({ msg: 'No cart!' })
        }

        res.status(200).json({ 
            products: cart.products,
            cartTotal: cart.cartTotal 
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.removeUserCart = async(req, res) => {
    try {
        const { id } = req.user

        const cart = await prisma.carts.findFirst({
            where: {
                orderById: Number(id)
            }
        })

        if(!cart) {
            return res.status(400).json({ msg: 'No cart!' })
        }

        await prisma.productsOnCarts.deleteMany({
            where: {
                cart: { orderById: Number(id) }
            }
        })

        const result = await prisma.carts.deleteMany({
            where: { orderById: Number(id) }
        })

        res.status(200).json({
            msg: 'Delete cart successful!',
            deleteCount: result.count
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.saveAddress = async(req, res) => {
    try {
        const { address } = req.body
        const { id } = req.user

        await prisma.users.update({
            where: {
                id: Number(id)
            },
            data: {
                address: address
            }
        })

        res.status(200).json({ msg: 'Address update successful!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.saveOrder = async(req, res) => {
    try {
        const { id } = req.user

        const userCart = await prisma.carts.findFirst({
            where: {
                orderById: Number(id)
            },
            include: {
                products: true
            }
        })

        if(!userCart || userCart.products.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' })
        }

        for(const item of userCart.products) {
            //console.log(item)
            const product = await prisma.products.findUnique({
                where: {
                    id: item.productId
                },
                select: {
                    quantity: true,
                    title: true
                }          
            })

            if(!product || item.count > product.quantity) {
                res.status(400).json({ msg: `Sorry, ${product.title || 'product'} is out of store` })
            }
        }

        const order = await prisma.orders.create({
            data: {
                products: {
                    create:userCart.products.map((item) => ({
                        productId: item.productId,
                        count: item.count,
                        price: item.count,
                    }))
                },
                orderById: Number(id) ,
                cartTotal: userCart.cartTotal
            }    
        })

        const updateProduct = userCart.products.map((item) =>({
            where: {
                id: item.productId
            },
            data: {
                quantity: { decrement: item.count },
                sold: { increment: item.count }
            }
        }))

        await Promise.all(
            updateProduct.map((update) => prisma.products.update(update))
        )

        await prisma.carts.deleteMany({
            where: {
                orderById: Number(id)
            }
        })

        res.status(200).json({ msg: 'User save order', order: order })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.listOrder = async(req, res) => {
    try {
        const { id } = req.user
        
        const orders = await prisma.orders.findMany({
            where: {
                orderById: Number(id)
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if(orders.length === 0) {
            return res.status(400).json({ msg: 'No order' })
        }

        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}