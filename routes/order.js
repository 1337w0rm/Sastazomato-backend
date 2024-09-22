import { Router } from 'express';
import Order from '../schemas/orderSchema.js';
import Cart from '../schemas/cartSchema.js';

const orderRouter = Router();

orderRouter.get('/', async (req, res) => {
    try {
        const userId = req.session.user.id;

        const orders = await Order.find({ user: userId })
            .populate('items.product')
            .sort({ orderDate: -1 }); // Sort by order date, newest first

        if (!orders || orders.length === 0) {
            return res
                .status(404)
                .json({ message: 'No orders found for this user' });
        }

        // Transform the data to include product details
        const formattedOrders = orders.map((order) => ({
            orderId: order.orderId,
            orderDate: order.orderDate,
            totalAmount: order.totalAmount,
            status: order.status,
            items: order.items.map((item) => ({
                product: {
                    name: item.product.name,
                    price: item.product.discountedPrice,
                    brand: item.product.brand,
                },
                quantity: item.quantity,
            })),
        }));

        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders: formattedOrders,
        });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

orderRouter.post('/neworder', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ user: userId }).populate(
            'items.product'
        );

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orders = await Order.find({ user: userId });
        const orderId = orders.length + 1;

        let totalAmount = 0;
        for (const item of cart.items) {
            totalAmount += item.product.discountedPrice * item.quantity;
        }

        let newOrder = new Order({
            orderId: orderId,
            user: userId,
            items: cart.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalAmount: totalAmount,
        });

        newOrder = await newOrder.save();
        newOrder = await newOrder.populate('items.product');

        // Clear the cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: newOrder,
        });
    } catch (error) {
        console.error('Error adding cart to order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default orderRouter;
