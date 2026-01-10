import TaskModel from "../models/Task.model.js";

export async function createTask(req, res) {
  const userID = req.user._id;
  const { title, description, status, category } = req.body;

  if (!userID) {
    return res
      .status(400)
      .json({ message: "You are not logged in to see the tasks " });
  }
  const createTask = await TaskModel.create({
    user: userID,
    title,
    description,
    status,
    category,
    userID,
  });
  await createTask.populate("user", "Username");
  res.status(200).json({
    message: "Task Created Successfully",
    success: true,
    task:createTask,
  });
}

export async function getTask(req, res) {
  const userID = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  // pagination logic
  const skip = (page - 1) * limit;
  const AllTasks = await TaskModel.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("user", "Username");

  if (!userID) {
    return res
      .status(400)
      .json({ message: "You are not logged in to see the tasks " });
  }
  const totalPost = await TaskModel.countDocuments();

  res.json({
    success: true,
    totalPages: Math.ceil(totalPost / limit),
    totalPost,
    AllTasks,
  });
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
  const userID = req.user._id;
  const postID = req.params.id;
  const findPost = await TaskModel.findById(postID);
  if (!findPost) {
    return res.json({ message: "Post Not Found" });
  }
  // owner check
  if (!findPost.user.equals(userID)) {
    return res.json({ message: "You are not authorised to update" });
  }
  await TaskModel.findByIdAndDelete(postID, { $pull: postID }, { new: true });
  res.json({ message: "Task Deleted" });
}
