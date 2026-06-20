import Task from "../models/Task.js";

export const getTasks = async (req, res, next) => {
  try {
    await Task.updateMany(
      { user: req.user._id, completed: true, status: { $exists: false } },
      { $set: { status: "Completed" }, $unset: { completed: "" } },
    );

    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }
    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be in the past",
        });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate: dueDate || null,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title !== undefined && !title.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be in the past",
        });
      }
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    await task.save();

    res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
