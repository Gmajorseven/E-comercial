const prisma = require('../config/prisma')

exports.changeOrderStatus = async(req, res) => {
    try {
        const { orderId, orderStatus } = req.body

        const orderUpdate = await prisma.orders.update({
            where: {
                id: Number(orderId)
            },
            data: {
                orderStatus: orderStatus
            }
        })

        res.status(200).json({ msg: 'Order update successful!', update: orderUpdate })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}

exports.getOrderAdmin = async(req, res) => {
    try {
        const { id } = req.user
        
        const orders = await prisma.orders.findMany({
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                orderedBy: {
                    select: {
                        id: true,
                        email: true,
                        address: true
                    }
                }
                
            }
        })

        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server error' })
    }
}