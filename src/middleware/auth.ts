import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

import User from "../models/user";
import configs from "../config/config";

const prisma = new PrismaClient();

const auth = async (req, res, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded: any = jwt.verify(token, configs.JWT_SECRET);

    // const user = await User.findOne({
    //   _id: decoded._id,
    //   "tokens.token": token,
    // });

    const user = await prisma.users.findUnique({
      where: {
        id: decoded._id,
      },
    });

    const validateToken = user.tokens.find((data) => data.token === token);
    
    if (!user || !validateToken) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (e) {
    return res.status(401).send("Unauthorized access!");
  }
};

export default auth;
