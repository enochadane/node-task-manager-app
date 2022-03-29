import fs from "fs";
import { promisify } from "util";

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";

import { sendCancelationEmail } from "../helpers/emails/account";

const unlinkAsync = promisify(fs.unlink);
const prisma = new PrismaClient();

const viewProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: req["user"].id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        password: false,
        tasks: {
          select: {
            completed: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Unauthorized access!");
    }

    res
      .status(200)
      .send({
        success: true,
        message: "user profile fetched successfully!",
        data: user,
      });
  } catch (error) {
    res.status(401).send({ success: false, message: error.message });
  }
};

const getUser = async (req: Request, res: Response) => {
  const _id = req.params.id;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: _id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        tasks: {
          select: {
            completed: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    res
      .status(200)
      .send({
        success: true,
        message: "user data fetched successfully!",
        data: user,
      });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid updates!" });
  }

  try {
    // updates.forEach((update) => (req.user[update] = req.body[update]));

    // await req.user.save();

    const userData = await prisma.users.findUnique({
      where: {
        id: req["user"].id,
      },
    });

    let password = userData.password;
    if (updates.includes("password")) {
      password = await bcrypt.hash(req.body.password, 8);
    }
    const age = req.body.age || userData.age;
    const email = req.body.email || userData.email;
    const name = req.body.name || userData.name;

    const user = await prisma.users.update({
      where: {
        id: userData.id,
      },
      data: {
        password,
        age,
        email,
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
      },
    });

    res
      .status(201)
      .send({
        success: true,
        message: "user data updated successfully!",
        data: user,
      });
  } catch (error) {
    res.status(400).send({ success: true, message: error.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.tasks.deleteMany({
      where: {
        owner: req["user"].id,
      },
    });

    const deletedUser = await prisma.users.delete({
      where: {
        id: req["user"].id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
      },
    });

    if (req["user"].avatar) {
      await unlinkAsync(req["user"].avatar);
    }

    sendCancelationEmail(deletedUser.email, deletedUser.name);
    res
      .status(200)
      .send({
        success: true,
        message: "user deleted successfylly!",
        data: deletedUser,
      });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

// const uploadImage = async (req, res) => {
//   console.log(req.file);
//   const buffer = await sharp(req.file.buffer)
//     .resize({ width: 250, height: 250 })
//     .png()
//     .toBuffer();
//   req.user.avatar = buffer;
//   await req.user.save();
//   res.status(200).send("File uploaded successfully!");
// };

const getImage = async (req: Request, res: Response) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: req["user"].id,
      },
    });

    if (!user || !user.avatar) {
      throw new Error("image not found!");
    }

    // res.set("Content-Type", "image/png");

    res
      .status(200)
      .send({
        success: true,
        message: "user image fetched successfully!",
        data: user.avatar,
      });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

const deleteImage = async (req: Request, res: Response) => {
  try {
    const user = await prisma.users.update({
      where: {
        id: req["user"].id,
      },
      data: {
        avatar: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        avatar: true
      }
    });

    if (!user || !user.avatar) {
      throw new Error("image not found!");
    }

    await unlinkAsync(user.avatar);

    res.status(200).send({ success: true, message: 'image deleted successfully', data: user });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

export { viewProfile, getUser, updateUser, deleteUser, deleteImage, getImage };
