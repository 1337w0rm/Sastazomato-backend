import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true,

    },
    originalPrice: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    }
})

productSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id;

        delete returnedObj._id,
        delete returnedObj.__v;
    }
})


const Product = mongoose.model("Product", productSchema);

export default Product