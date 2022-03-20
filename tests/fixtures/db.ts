import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../../src/models/user";
import Task from "../../src/models/task";

jest.setTimeout(200000);

const userId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const sampleUser = {
  _id: userId,
  name: "sample user",
  email: "sample@user.com",
  password: "test1234",
  tokens: [
    {
      token: jwt.sign({ _id: userId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwo = {
  _id: userTwoId,
  name: "usertwo",
  email: "two@user.com",
  password: "test1234",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "task one",
  completed: false,
  owner: userId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "task two",
  completed: true,
  owner: userId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "task three",
  completed: true,
  owner: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(sampleUser).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
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
