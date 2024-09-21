import { Router } from 'express';
import Product from '../schemas/productSchema.js';
import Cart from '../schemas/cartSchema.js';
const cartRouter = Router();

cartRouter.get('/', async (req, res) => {
    const cart = await Cart.findOne({ user: req.session.user.id }).populate(
        'items.product'
    );
    res.status(200).send(cart);
});

cartRouter.post('/add', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).send({ error: 'Product ID is required' });

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ user: req.session.user.id });

    const itemData = {
        product,
    };

    cart.items = cart.items.concat(itemData);
    await cart.save();

    const addedItem = await Cart.findOne({ 'items.product': id }).populate(
        'items.product'
    );
    res.status(201).send({ message: 'Item added to cart' });
});

cartRouter.delete('/delete/:id', async (req, res) => {
    const productId = req.params.id;
    if (!productId)
        return res.status(400).send({ error: 'Product ID is required' });

    const cart = await Cart.findOne({ user: req.session.user.id });
    cart.items = cart.items.filter((item) => !item.product.equals(productId));
    await cart.save();
    res.status(200).send({ message: 'Item deleted from cart' });
});

cartRouter.patch('/update/:id', async (req, res) => {
    const productId = req.params.id;
    const { quantity } = req.body;

    if (!productId || !quantity)
        return res.status(400).send({ error: 'Some error occured' });

    const updatedCart = await Cart.findOneAndUpdate(
        {
            user: req.session.user.id,
            'items.product': productId,
        },
        {
            $set: { 'items.$.quantity': quantity },
        },
        { new: true }
    );

    if (!updatedCart)
        return res.status(404).send({ error: 'Product not found' });

    return res.status(200).send({ message: 'Quantity Updated' });
});

export default cartRouter;
