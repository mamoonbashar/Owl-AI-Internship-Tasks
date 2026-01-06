import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  path: "/",
  httpOnly: true,
  secure: isProduction,
  sameSite: "Lax",
  maxAge: 24 * 60 * 60 * 1000,
};

export async function createUser(req, res) {
  const { Username, email, password, profile } = req.body;
  try {
    const userExist = await UserModel.findOne({ email }).select("-password");
    if (!Username || !email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already exist please login" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userCreation = await UserModel.create({
      Username,
      password: hashPassword,
      email,
      profile,
    });
    let token = generateToken(userCreation);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      message: "User created Successfully",
      success: true,
      data: {
        user: {
          id: userCreation.id,
          username: userCreation.Username,
          email: userCreation.email,
          profile: userCreation.profile,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      Error: error.message,
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    const userID = await UserModel.findOne({ email });
    const isMatch = await bcrypt.compare(password, userID.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }
    let token = generateToken(userID);
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Logged In Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      Error: error.message,
    });
  }
}
export async function logout(req, res) {
  const { maxAge, ...clearCookie } = cookieOptions;
  try {
    res.cookie("token", clearCookie);
    return res.status(200).json({ message: "You Logged Out Successfully " });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      Error: error.message,
    });
  }
}

export async function deleteAccount(req, res) {}
