import connectDb from "../../utils/connectDb";
import Product from "../../models/Product";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await handlePostRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed.`);
      break;
  }
};

async function handlePostRequest(req, res) {
  const { name, price, description, mediaUrl } = req.body;
  try {
    if (!name || !price || !description || !mediaUrl) {
      return res.status(422).send("Product missing one or more fields!");
    }
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl
    }).save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while creating product.");
  }
}

async function handleDeleteRequest(req, res) {
  try {
    const { _id } = req.query;
    // deleteOne deletes the document
    // await Product.deleteOne({ _id: _id });
    // findOneAndDelete deletes it AND returns it
    await Product.findOneAndDelete({ _id: _id });
    res.status(204).json({});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while deleting product.");
  }
}
