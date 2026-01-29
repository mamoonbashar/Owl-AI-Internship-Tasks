import TaskModel from "../models/Task.model.js";

export async function createTask(req, res) {
  try {
    const userID = req.user._id;
    const { title, description, status, category, dueDate, priority } =
      req.body;

    const newTask = await TaskModel.create({
      user: userID,
      title,
      description,
      status: status || "pending",
      category: category || "others",
      dueDate,
      priority: priority || "Low",
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
}
export async function getTask(req, res) {
 try {
   if (!req.user) {
     return res.status(401).json({ message: "Unauthorized" });
   }

   const userID = req.user._id;
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 10;
   const skip = (page - 1) * limit;

   // 2. Filter by user: IMPORTANT so users don't see other people's tasks
   const AllTasks = await TaskModel.find({ user: userID })
     .skip(skip)
     .limit(limit)
     .sort({ createdAt: -1 });

   // Note: If you want the frontend map to work directly,
   // it's best to return the array directly or ensure the frontend
   // points to the correct property.
   res.status(200).json(AllTasks);
 } catch (error) {
   res.status(500).json({ Error: error.message });
 }
}

export async function updateTask(req, res) {
  try {
    const userID = req.user._id;
    const paramID = req.params.id;

    const findPost = await TaskModel.findById(paramID);
    if (!findPost) return res.status(404).json({ message: "Post Not Found" });

    // FIX: Convert both to strings to ensure they match
    if (findPost.user.toString() !== userID.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newData = await TaskModel.findByIdAndUpdate(
      paramID,
      { $set: req.body }, // Directly set the body (ensure frontend uses correct keys)
      { new: true, runValidators: true },
    );

    return res
      .status(200)
      .json({ message: "Task Updated", newData, success: true });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
}

export async function deleteTask(req, res) {
  try {
    const userID = req.user._id;
    const postID = req.params.id;

    const findPost = await TaskModel.findById(postID);
    if (!findPost) return res.status(404).json({ message: "Post Not Found" });

    // FIX: String comparison
    if (findPost.user.toString() !== userID.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await TaskModel.findByIdAndDelete(postID);
    res.json({ message: "Task Deleted", success: true });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
}
