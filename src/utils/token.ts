import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";

import configs from "../config/config";

const prisma = new PrismaClient();
const _id = new mongoose.Types.ObjectId();

export const generateAuthToken = async (payload: any, tokens: any) => {
  const token = jwt.sign({ _id: payload._id }, configs.JWT_SECRET);

  const user = await prisma.users.findUnique({
    where: {
      id: payload._id,
    },
  });

  user.tokens.push({ id: _id.toString(), token });

  await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      tokens: user.tokens,
    },
  });

  return token;
};
