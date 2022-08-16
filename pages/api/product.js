import connectDb from "../../utils/connectDb";
import Product from "../../models/Product";

export default async (req, res) => {
  switch (req.method) {
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed.`);
      break;
  }
}

async function handleDeleteRequest(req, res) {
  connectDb();
  const { _id } = req.query;
  // deleteOne deletes the document
  // await Product.deleteOne({ _id: _id });
  // findOneAndDelete deletes it AND returns it
  await Product.findOneAndDelete({ _id: _id });
  res.status(204).json({});
}