import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getTasks = async (req: Request, res: Response) => {
  let completed: boolean;
  let sort = {};

  if (req.query.completed) {
    completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = (<string>req.query.sortBy).split(":");
    sort[parts[0]] = parts[1];
  }

  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        owner: req["user"].id,
        completed,
      },
      select: {
        id: true,
        completed: true,
        description: true,
        user: {
          select: {
            name: true,
            email: true,
            age: true,
          },
        },
      },
      take: parseInt(<string>req.query.limit || "10"),
      skip: parseInt(<string>req.query.skip || "0"),
      orderBy: sort,
    });
    res.status(200).send({
      success: true,
      message: "tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const getTask = async (req: Request, res: Response) => {
  const _id = req.params.id;

  if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .send({ success: false, message: "Id is not valid." });
  }

  try {
    const task = await prisma.tasks.findMany({
      where: {
        id: _id,
        owner: req["user"].id,
      },
      select: {
        id: true,
        completed: true,
        description: true,
        user: {
          select: {
            name: true,
            email: true,
            age: true,
          },
        },
      },
    });

    console.log(task, "task...");

    if (!task || task.length === 0) {
      throw new Error("Task not found!");
    }

    res.status(200).send({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const postTask = async (req: Request, res: Response) => {
  const task = { ...req.body, owner: req["user"].id };

  try {
    const createdTask = await prisma.tasks.create({
      data: task,
      select: {
        id: true,
        completed: true,
        description: true,
        user: {
          select: {
            name: true,
            email: true,
            age: true,
          },
        },
      },
    });

    res.status(201).send({
      success: true,
      message: "task created successfully!",
      data: createdTask,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const updateTask = async (req: Request, res: Response) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .send({ success: false, message: "Id is not valid." });
  }

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
        owner: req["user"].id,
      },
    });

    if (task.length === 0) {
      throw new Error("Task not found!");
    }

    let completed: boolean;
    if (req.body.completed != undefined) {
      completed = req.body.completed;
    } else {
      completed = task[0].completed;
    }

    const updatedTask = await prisma.tasks.update({
      where: {
        id: req.params.id,
      },
      data: {
        completed,
        description: req.body.description || task[0].description,
      },
      select: {
        id: true,
        completed: true,
        description: true,
        user: {
          select: {
            name: true,
            email: true,
            age: true,
          },
        },
      },
    });

    res.status(201).send({
      success: true,
      message: "task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .send({ success: false, message: "Id is not valid." });
  }

  try {
    const task = await prisma.tasks.findFirst({
      where: {
        id: req.params.id,
        owner: req["user"].id,
      },
    });

    if (!task) {
      throw new Error("Task not found!");
    }

    const deletedTask = await prisma.tasks.delete({
      where: {
        id: task.id,
      },
      select: {
        id: true,
        completed: true,
        description: true,
        user: {
          select: {
            name: true,
            email: true,
            age: true,
          },
        },
      },
    });

    res.status(200).send({
      success: true,
      message: "task deleted successfully!",
      data: deletedTask,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

export { getTasks, getTask, postTask, updateTask, deleteTask };
