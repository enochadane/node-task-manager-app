import Task from "../models/task";

const getTasks = async (req, res) => {
  let match: {
    completed: Boolean;
  };
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.status(200).send({ success: true, message: req.user.tasks });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const getTask = async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    await task.populate("owner");

    if (!task) {
      return res
        .status(404)
        .send({ success: false, message: "Couldn't fetch task!" });
    }

    res.status(200).send({ success: true, message: task });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const postTask = async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send({ success: true, message: task });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ success: false, message: "Invalid message" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res
        .status(400)
        .send({ success: false, message: "Couldn't fetch tasks!" });
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.status(201).send({ success: true, message: task });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .send({ success: false, message: "Couldn't fetch task!" });
    }

    res.status(200).send({ success: true, message: task });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

export { getTasks, getTask, postTask, updateTask, deleteTask };
