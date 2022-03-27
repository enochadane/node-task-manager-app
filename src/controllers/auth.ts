import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient, users } from "@prisma/client";

import { sendWelcomeEmail } from "../helpers/emails/account";
import { generateAuthToken } from "../utils/token";

const prisma = new PrismaClient();

const signUp = async (req: Request, res: Response) => {
  const password = await bcrypt.hash(req.body.password, 8);
  const user: users = {
    ...req.body,
    age: parseInt(req.body.age),
    password,
  };

  try {
    const createdUser = await prisma.users.create({
      data: user,
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
      },
    });

    sendWelcomeEmail(createdUser.email, createdUser.name);

    const payload = {
      _id: createdUser.id,
    };

    const token = await generateAuthToken(payload);

    res.status(201).send({
      success: true,
      message: "user created successfully!",
      data: { createdUser, token },
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Login Failed!");
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password.toString()
    );

    if (!isMatch) {
      throw new Error("Login Failed!");
    }

    const userId = user.id;
    const userName = user.name;
    const userEmail = user.email;
    const userAge = user.age;

    const signedInUser = {
      userId,
      userName,
      userEmail,
      userAge,
    };

    const token = await generateAuthToken({ _id: user.id });

    res.status(200).send({
      success: true,
      message: "user signed in successfylly",
      data: { signedInUser, token },
    });
  } catch (error) {
    res.status(400).send({ success: false, message: (error as Error).message });
  }
};

const signOut = async (req: Request, res: Response) => {
  try {
    req["user"].tokens = req["user"].tokens.filter((token) => {
      return token.token !== req["token"];
    });

    const user = await prisma.users.update({
      where: {
        id: req["user"].id,
      },
      data: {
        tokens: req["user"].tokens,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
      },
    });

    res
      .status(200)
      .send({ success: true, message: "User Signed out!", data: user });
  } catch (e) {
    res.status(401).send({ success: false, message: "Unauthorized access!" });
  }
};

const signOutAll = async (req: Request, res: Response) => {
  try {
    const user = await prisma.users.update({
      where: {
        id: req["user"].id,
      },
      data: {
        tokens: [],
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
      },
    });

    res
      .status(200)
      .send({ success: true, message: "Terminated all sessions!", data: user });
  } catch (e) {
    res.status(401).send({ success: false, message: "Unauthorized access!" });
  }
};

export { signUp, signIn, signOut, signOutAll };
