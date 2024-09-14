import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    phone: {
        type: Number,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist',
    },
});

userSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id;

        delete returnedObj._id, delete returnedObj.__v;
        delete returnedObj.password;
    },
});

const User = mongoose.model('User', userSchema);

export default User;
