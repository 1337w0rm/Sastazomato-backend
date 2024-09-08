import express from 'express';
const app = express();
const PORT = process.env.PORT || 4000;

import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import MongoStore from 'connect-mongo';

import { errorHandler, logger, checkAuthorized } from './utils/middleware.js';
import userRouter from './routes/users.js';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';

mongoose
    .connect(process.env.MONGODBURI)
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.log(err));

const URL =
    process.env.NODE_ENV === 'production'
        ? process.env.PRODURL
        : process.env.DEVURL;

app.use(
    cors({
        origin: URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);

app.use(express.json());
app.use(logger);

app.use(
    session({
        saveUninitialized: false,
        resave: false,
        secret: process.env.SESSION_SECRET,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 60000 * 60 * 24,
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    })
);

app.get('/', (req, res) => {
    res.status(200).send('Server running');
});

app.use('/api/user', userRouter);
app.use('/api/products', checkAuthorized, productRouter);
app.use('/api/cart', checkAuthorized, cartRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started on ${URL}:${PORT}`);
});

export default app;
