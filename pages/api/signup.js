import bcrypt from "bcrypt";
import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import Cart from "../../models/Cart";
import jwt from "jsonwebtoken";
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

connectDb();

export default async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  try {
    // Check if the submitted data is valid
    if (!isLength(name, { min: 3, max: 12 })) {
      return res.status(422).send("Name must be 3-12 characters long!");
    } else if (!isLength(password, { min: 6 })) {
      return res.status(422).send("Password must be at least 6 characters long!");
    } else if (!isEmail(email)) {
      return res.status(422).send("E-mail must be valid!");
    }
    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`User with e-mail ${email} already exists.`);
    }
    // If not, hash their password
    const hash = await bcrypt.hash(password, 10);
    // Create user
    const newUser = await new User({
      name,
      email,
      password: hash
    }).save();
    console.log(newUser);
    // Create a cart for the new user
    await new Cart({ user: newUser._id }).save();
    // Create token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    // Send back the token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while creating user, please try again later.");
  }
};
