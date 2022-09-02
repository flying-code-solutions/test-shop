import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import connectDb from '../../utils/connectDb';

const { ObjectId } = mongoose.Types;

connectDb();

export default async (req, res) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token!");
  }

  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Methos ${req.method} not allowed!`);
      break;
  }
}

async function handleGetRequest(req, res) {
  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product"
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again.");
  }
}

async function handlePutRequest(req, res) {
  const { quantity, productId } = req.body;
  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    // get user cart with userId
    const cart = await Cart.findOne({ user: userId });
    // check if product already is in the cart
    const productExists = cart.products.some((doc) => ObjectId(productId).equals(doc.product));
    // if so, increment quantity
    if (productExists) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, "products.product": productId },
        { $inc: { "products.$.quantity": quantity } }
      );
    } else {
      // if not, add the product
      const newProduct = { quantity, product: productId };
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $addToSet: { products: newProduct } }
      );
    }
    res.status(200).send("Cart updated.");
  } catch (erorr) {
    console.error(error);
    res.status(403).send("Please login again.");
  }
}

async function handleDeleteRequest(req, res) {
  const productId = req.query.productId;
  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    // get user cart with userId
    const cart = await Cart.findOne({ user: userId });
    // check if product already is in the cart
    const productExists = cart.products.some((doc) => ObjectId(productId).equals(doc.product));
    // if (productExists) {
    //   await Cart.findOneAndUpdate(
    //     { _id: cart._id, "products.product": productId }
    //   );
    // }
    res.status(204).send("Product removed from cart.");
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again.");
  }
}