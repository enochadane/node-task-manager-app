import fs from "fs";
import { promisify } from "util";

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

import { sendCancelationEmail } from "../helpers/emails/account";

const unlinkAsync = promisify(fs.unlink);
const prisma = new PrismaClient();

const viewProfile = async (req, res) => {
  const user = await prisma.users.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      tasks: {
        select: {
          completed: true,
          description: true,
        },
      },
    },
  });

  if (req.user) {
    return res.status(200).send({ success: true, message: user });
  }

  res.status(401).send({ success: false, message: "Unauthorized access!" });
};

const getUser = async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: _id,
      },
      include: {
        tasks: {
          select: {
            completed: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Couldn't find user!" });
    }

    res.status(200).send({ success: true, message: user });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
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
        id: req.user.id,
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
        id: req.user.id,
      },
      data: {
        password,
        age,
        email,
        name,
      },
    });

    res.status(201).send({ success: true, message: user });
  } catch (error) {
    res.status(400).send({ success: true, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await prisma.tasks.deleteMany({
      where: {
        owner: req.user.id,
      },
    });

    await prisma.users.delete({
      where: {
        id: req.user.id,
      },
    });

    if (req.user.avatar) {
      await unlinkAsync(req.user.avatar);
    }

    sendCancelationEmail(req.user.email, req.user.name);
    res.status(200).send({ success: true, message: req.user });
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

const getImage = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");

    res.status(200).send({ success: true, message: user.avatar });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const user = await prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        avatar: "",
      },
    });

    if (req.user.avatar) {
      await unlinkAsync(req.user.avatar);
    }

    res.status(200).send({ success: true, message: user });
  } catch (e) {
    res.status(400).send({ success: false, message: e.message });
  }
};

export { viewProfile, getUser, updateUser, deleteUser, deleteImage, getImage };
