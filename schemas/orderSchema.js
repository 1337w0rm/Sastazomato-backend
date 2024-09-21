import mongoose, { mongo } from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Preparing', 'On the way', 'Delivered'],
        default: 'Delivered',
    },
    totalAmount: {
        type: Number,
        required: true,
    },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
