import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: [true, "Title is required"],
      maxlength: [50, "Title Cannot be more than 50 characters"],
    },
    description: {
      type: String,
      required: true,
      maxlength: [600, "Description cannot be more than 600 characters"],
    },
    status: {
      type: String,
      required: true,
      enum: ["completed", "pending", "progress"],
      default: "Others",
    },
    category: {
      type: String,
      required: true,
      enum: ["Work", "Home", "others"],
      default: "Others",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
