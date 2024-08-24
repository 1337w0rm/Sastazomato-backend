import mongoose from 'mongoose';

const wishlistItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
});

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [wishlistItemSchema],
});

wishlistSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id;

        delete returnedObj._id, delete returnedObj.__v;
    },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
