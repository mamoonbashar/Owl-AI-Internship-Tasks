import jwt from "jsonwebtoken";
import UserModel from "../models/User.model.js";

export async function isLoggedin(req, res, next) {
  let token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "You are not logged In" });
  }
  try {
    let decode = jwt.verify(token, process.env.JWT_KEY);
    let user = await UserModel.findOne({ email: decode.email }).select(
      "-password"
    );
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
