import { Router } from "express";
import Product from "../schemas/productSchema.js";

const productRouter = Router();

productRouter.get('/', async (req, res) => {
    const products = await Product.find({});
    res.status(200).send(products);
})


export default productRouter;