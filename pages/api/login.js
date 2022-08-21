import bcrypt from "bcrypt";
import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import jwt from "jsonwebtoken";

connectDb();

export default async (req, res) => {
  const { email, password } = req.body;

  try {
    // check to see if a user exists with the provided e-mail
    const user = await User.findOne({ email }).select("+password");
    // if not, return error
    if (!user) {
      return res.status(404).send("There is no user with the provided e-mail.");
    }
    // check to see if the password is correct
    const passwordsMatch = await bcrypt.compare(password, user.password);
    // if yes, generate a token
    if (passwordsMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // send that token to the client
      res.status(200).json(token);
    } else {
      res.status(401).send("Incorrect password.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user.");
  }
}