import mongoose from "mongoose";

const { Schema } = mongoose;
const { String } = mongoose.Schema.Types;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["user", "admin", "root"]
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
