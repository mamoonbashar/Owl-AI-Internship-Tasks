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
  const { Username, email, password, profileImage } = req.body;
  try {
    if (!Username || !email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // If no image is uploaded, generate one using their name and your theme color (#f56565)
    const finalProfile =
      profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(Username)}&background=f56565&color=fff`;

    const userCreation = await UserModel.create({
      Username,
      password: hashPassword,
      email,
      profile: finalProfile,
    });

    let token = generateToken(userCreation);
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "User created Successfully",
      success: true,
      data: {
        user: {
          id: userCreation._id,
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

export async function deleteAccount(req, res) {
  const userID = req.user.id;
  try {
    if (!userID) {
      return res.status(401).json({ message: "You are not authorised" });
    }
    // check the user
    const findUser = await UserModel.findById(userID);

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Checkt owner
    if (!findUser._id.equals(userID)) {
      return res
        .status(400)
        .json({ message: "You are not authorised to do this " });
    }
    await UserModel.findByIdAndDelete(userID);
    return res
      .status(200)
      .json({ message: "User Deleted Successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      Error: error.message,
    });
  }
}
export async function getUserDetails(req, res) {
  try {
    // req.user.id comes from your 'isLoggedIn' or 'protect' middleware
    const userID = req.user.id;

    // Find user and exclude the password for security
    const user = await UserModel.findById(userID).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        username: user.Username,
        email: user.email,
        profile: user.profile,
        
        id: user._id,
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
export async function editUserDetails(req, res) {
  const userID = req.user.id; // From your auth middleware
  const { Username, email, profile } = req.body;

  try {
    if (!userID) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 1. Prepare update object
    const updateData = {};
    if (Username) updateData.Username = Username;
    if (email) updateData.email = email;

    // 2. Handle Profile Logic
    // If user provides a new profile link, use it.
    // Otherwise, if they only changed their name, update the default avatar initials.
    if (profile) {
      updateData.profile = profile;
    } else if (Username) {
      updateData.profile = `https://ui-avatars.com/api/?name=${encodeURIComponent(Username)}&background=f56565&color=fff`;
    }

    // 3. Update in MongoDB
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { $set: updateData },
      { new: true, runValidators: true }, // 'new' returns the modified document
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        username: updatedUser.Username,
        email: updatedUser.email,
        profile: updatedUser.profile,
        id: updatedUser._id,
        
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