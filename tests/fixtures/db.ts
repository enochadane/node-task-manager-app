import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

import { ObjectId } from "mongodb";

jest.setTimeout(100000);

const prisma = new PrismaClient();
const userId = new ObjectId();
const userTwoId = new ObjectId();

const sampleUser = {
  id: userId.toString(),
  name: "prisma client",
  age: 22,
  email: "prisma@user.com",
  password: "test1234",
  tokens: [
    {
      token: jwt.sign({ _id: userId }, process.env.JWT_SECRET),
      id: new ObjectId().toString(),
    },
  ] as any,
};

const userTwo = {
  id: userTwoId.toString(),
  name: "usertwo",
  age: 23,
  email: "two@user.com",
  password: "test1234",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
      id: new ObjectId().toString(),
    },
  ] as any,
};

const taskOne = {
  id: new ObjectId().toString(),
  description: "task one",
  completed: false,
  owner: userId.toString(),
};

const taskTwo = {
  id: new ObjectId().toString(),
  description: "task two",
  completed: true,
  owner: userId.toString(),
};

const taskThree = {
  id: new ObjectId().toString(),
  description: "task three",
  completed: true,
  owner: userTwoId.toString(),
};

const setupDatabase = async () => {
  await prisma.tasks.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.users.create({
    data: sampleUser,
  });
  await prisma.tasks.create({
    data: taskOne,
  });
  await prisma.tasks.create({
    data: taskTwo,
  });
  await prisma.tasks.create({
    data: taskThree,
  });
};

export {
  userId,
  sampleUser,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
