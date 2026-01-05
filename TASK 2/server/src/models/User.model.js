import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    Username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);
