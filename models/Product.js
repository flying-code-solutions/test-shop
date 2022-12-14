import mongoose from "mongoose";
import shortid from "shortid";

const { Schema } = mongoose;
const { String, Number } = Schema.Types;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sku: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  description: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  }
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
