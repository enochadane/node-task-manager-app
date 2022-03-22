import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { sendWelcomeEmail } from "../helpers/emails/account";
import { generateAuthToken } from "../utils/token";

const prisma = new PrismaClient();

const signUp = async (req: Request, res: Response) => {
  const password = await bcrypt.hash(req.body.password, 8);
  const user: any = {
    ...req.body,
    age: parseInt(req.body.age),
    password,
    avatar: req.file.path,
  };

  try {
    const userObject = await prisma.users.create({
      data: user,
    });
    
    sendWelcomeEmail(user.email, user.name);
    
    const payload = {
      _id: userObject.id,
    };
    
    const token = await generateAuthToken(payload, userObject.tokens);
    
    res.status(201).send({ success: true, message: { user, token } });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user: any = await prisma.users.findUnique({
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

    const token = await generateAuthToken({ _id: user.id }, user.tokens);
    
    res.status(200).send({ success: true, message: { user, token } });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const signOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        tokens: req.user.tokens,
      },
    });

    res.status(200).send({ success: true, message: "User Signed out!" });
  } catch (e) {
    res.status(401).send({ success: false, message: "Unauthorized access!" });
  }
};

const signOutAll = async (req, res) => {
  try {
    req.user.tokens = [];

    await prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        tokens: [],
      },
    });

    res
      .status(200)
      .send({ success: true, message: "Terminated all sessions!" });
  } catch (e) {
    res.status(401).send({ success: false, message: "Unauthorized access!" });
  }
};

export { signUp, signIn, signOut, signOutAll };
