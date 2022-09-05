import Stripe from "stripe";
import uuidv4 from "uuidv4";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import calculateCartTotal from "../../utils/calculateCartTotal";
import Order from "../../models/Order";
import shortid from "shortid";

const stripe = Stripe(process.env.STRIPE_SECRET_TEST_KEY);

export default async (req, res) => {
  const { paymentData } = req.body;

  try {
    // verify and get user from token
    const { userId } =  jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    // find cart based on user id, populate
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product"
    });
    // calculate cart totals again from cart products
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);
    // get email for payment data, see if email linked with existing Stripe customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1
    });
    const isExistingCustomer = prevCustomer.data.length > 0;
    // if not, create them based on their email
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id
      });
    }
    const customer = (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;
    // create charge with total, sned receipt email
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: stripeTotal,
      receipt_email: paymentData.email,
      customer,
      description: `Checkout | ${paymentData.email} | ${paymentData.id}`
    }, {
      idempotencyKey: shortid.generate()
    });
    // add order data to database
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products
    }).save();
    // clear products in cart
    await Cart.findOneAndUpdate(
      { _id: cart._id },
      { $set: { products: [] } }
    );
    // send back success response
    res.status(200).send("Checkout successful.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing charge!");
  }
}
