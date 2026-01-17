import TaskModel from "../models/Task.model.js";

export async function createTask(req, res) {
 try {
   // 1. Safety Check: Check req.user BEFORE accessing ._id
   if (!req.user) {
     return res.status(401).json({ message: "Unauthorized: User not found" });
   }

   const userID = req.user._id;
   const { title, description, status, category } = req.body;

   const newTask = await TaskModel.create({
     user: userID,
     title,
     description,
     status: status || "Pending",
     category: category || "Others",
   });

   await newTask.populate("user", "Username");

   res.status(201).json(newTask); // Return the task directly so frontend map works
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
  const userID = req.user._id;
  const paramID = req.params.id;
  const findPost = await TaskModel.findById(paramID);
  const updatedTask = {};
  if (!findPost) {
    return res.json({ message: "Post Not Found" });
  }
  const allowedFelds = ["title", "description", "status", "category"];

  for (let key of allowedFelds) {
    if (req.body[key] !== undefined) {
      updatedTask[key] = req.body[key];
    }
  }
  if (Object.keys(updatedTask).length === 0) {
    return res.json({ message: "Nothing to update" });
  }
  // owner check
  if (!findPost.user.equals(userID)) {
    return res.json({ message: "You are not authorised to update" });
  }

  //   update post
  const newData = await TaskModel.findByIdAndUpdate(
    paramID,
    { $set: updatedTask },
    {
      new: true,
      runValidators: true,
    }
  );
  return res.json({ message: "Task Updated", newData, success: true });
}

export async function deleteTask(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userID = req.user._id;
    const postID = req.params.id;

    const findPost = await TaskModel.findById(postID);
    if (!findPost) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    // Owner check
    if (!findPost.user.equals(userID)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this" });
    }

    await TaskModel.findByIdAndDelete(postID);
    res.json({ message: "Task Deleted", success: true });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
}
