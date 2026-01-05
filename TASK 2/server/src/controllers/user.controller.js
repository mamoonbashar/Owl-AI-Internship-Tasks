import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.model";

export async function createUser(req, res) {
  const { Username, email, password, profile } = req.body;
  const userExist = await UserModel.find({ email: email }).select("-password");
  if (!userExist) {
    return res.status(400).json({ message: "User already exist please login" });
  }
  if (req.body === "") {
    return res.status(400).json({ message: "All Fields are required" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const userCreation = UserModel.create({
    Username: Username,
    password: hashPassword,
    email: email,
    profile: profile,
  });
}
export async function login(req, res) {}
export async function logout(req, res) {}
