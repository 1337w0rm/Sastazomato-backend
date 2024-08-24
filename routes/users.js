import { Router } from 'express';
import { comparePassword, hashPassword } from '../utils/passwordHashing.js';
import User from '../schemas/userSchema.js';
import Cart from '../schemas/cartSchema.js';
import Wishlist from '../schemas/wishlistSchema.js';
const userRouter = Router();

userRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const passwordHash = hashPassword(password);
    const newCart = new Cart();
    const newWishlist = new Wishlist();
    const newUser = new User({
        username,
        password: passwordHash,
        cart: newCart._id,
        wishlist: newWishlist._id,
    });

    newCart.user = newUser._id;
    newWishlist.user = newUser._id;

    try {
        const savedUser = await newUser.save();
        await newCart.save();
        await newWishlist.save();
    } catch (err) {
        return next(err);
    }

    res.status(201).send({ message: 'User registration Successfull' });
});

userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res
            .status(400)
            .send({ error: 'Email and password are required' });

    const user = await User.findOne({ username }).populate('cart');

    if (!user || !comparePassword(password, user.password))
        return res.status(401).send({ error: 'Inavlid username or password' });

    req.session.user = { id: user.id };
    console.log(user);
    res.status(200).send({ message: 'Successfull', user });
});

userRouter.get('/status', async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ isAuthenticated: false });
    const userId = req.session.user.id;
    const user = await User.findById(userId).populate('cart.product');
    if (!user) return res.status(401).send({ isAuthenticated: false });

    return res.status(200).send({ isAuthenticated: true, user });
});

export default userRouter;
