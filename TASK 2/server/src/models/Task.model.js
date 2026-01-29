import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 50 },
    description: { type: String, required: true, maxlength: 600 },
    // ADD THIS FIELD
    dueDate: { type: String },
    status: {
      type: String,
      required: true,
      enum: ["completed", "pending", "progress"],
      default: "pending",
    },
    category: {
      type: String,
      required: true,
      enum: ["Work", "Home", "others"],
      default: "others",
    },
  },
  { timestamps: true },
);
export default mongoose.model("Task", taskSchema);
