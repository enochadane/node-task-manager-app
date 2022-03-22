import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getTasks = async (req, res) => {
  let completed: boolean;
  let sort = {};

  if (req.query.completed) {
    completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1];
  }

  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        owner: req.user.id,
        completed,
      },
      include: {
        user: {
          select: {
            name: true,
            age: true,
          },
        },
      },
      take: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      orderBy: sort,
    });
    res.status(200).send({ success: true, message: tasks });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const getTask = async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await prisma.tasks.findMany({
      where: {
        id: _id,
        owner: req.user.id,
      },
      include: {
        user: true,
      },
    });

    if (task.length === 0) {
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
  const task = { ...req.body, owner: req.user.id };
  console.log(task);

  try {
    const taskCreated = await prisma.tasks.create({
      data: task,
    });

    res.status(201).send({ success: true, message: taskCreated });
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
    return res
      .status(400)
      .send({ success: false, message: "Invalid updates!" });
  }

  try {
    const task = await prisma.tasks.findMany({
      where: {
        id: req.params.id,
        owner: req.user.id,
      },
    });

    if (task.length === 0) {
      return res
        .status(400)
        .send({ success: false, message: "Couldn't find task" });
    }

    let completed: boolean;
    if (req.body.completed != undefined) {
      completed = req.body.completed;
    } else {
      completed = task[0].completed;
    }

    const udpatedTask = await prisma.tasks.update({
      where: {
        id: req.params.id,
      },
      data: {
        completed,
        description: req.body.description || task[0].description,
      },
    });

    res.status(201).send({ success: true, message: udpatedTask });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await prisma.tasks.findFirst({
      where: {
        id: req.params.id,
        owner: req.user.id,
      },
    });

    if (!task) {
      return res
        .status(404)
        .send({ success: false, message: "Couldn't find task!" });
    }

    await prisma.tasks.delete({
      where: {
        id: task.id,
      },
    });

    res.status(200).send({ success: true, message: task });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

export { getTasks, getTask, postTask, updateTask, deleteTask };
