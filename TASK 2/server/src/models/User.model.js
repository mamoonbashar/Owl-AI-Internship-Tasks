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
    profile: {
      url: {
        type: String,
        default:
          "https://ui-avatars.com/api/?background=f56565&color=fff&name=User", // Default avatar
      },
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
  
  },

  { timestamps: true },
);

export default mongoose.model("User", userSchema);
