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
      dueDate: dueDate || null,
      priority: priority || "Low",
    });

    // ✅ CRITICAL: Populate user so frontend doesn't break
    await newTask.populate("user", "username");

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

    const AllTasks = await TaskModel.find({ user: userID })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

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

    if (findPost.user.toString() !== userID.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Only allow specific fields to be updated
    const allowedFields = [
      "title",
      "description",
      "status",
      "category",
      "dueDate",
      "priority",
    ];
    const updateData = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const newData = await TaskModel.findByIdAndUpdate(
      paramID,
      { $set: updateData },
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

    if (findPost.user.toString() !== userID.toString()) {
      return res.status(403).json({ message: "Unauthorized" });

    }

    await TaskModel.findByIdAndDelete(postID);
    res.json({ message: "Task Deleted", success: true });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
}
