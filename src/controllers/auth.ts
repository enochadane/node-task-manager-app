import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user";
import { sendWelcomeEmail } from "../helpers/emails/account";

const signUp = async (req: Request, res: Response) => {
  const user: any = new User({ ...req.body, avatar: req.file.path });

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ success: true, message: { user, token } });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user: any = await User.findOne({ email });

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

    const token = await user.generateAuthToken();
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

    await req.user.save();

    res.status(200).send({ success: true, message: "User Signed out!" });
  } catch (e) {
    res.status(401).send({ success: false, message: "Unauthorized access!" });
  }
};

const signOutAll = async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res
      .status(200)
      .send({ success: true, message: "Terminated all sessions!" });
  } catch (e) {
    res.status(401).send({ success: false, message: "Unauthorized access!" });
  }
};

export { signUp, signIn, signOut, signOutAll };
