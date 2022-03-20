import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Task from "./task";
import configs from "../config/config";

export interface IUserDocument extends Document {
  name: String;
  email: String;
  password: String;
  age: Number;
  tokens: Object[];
  avatar: String;
  findByCredentials: Function;
}

const userSchema: Schema<IUserDocument> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password should be stronger!");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age should be greater that 0!");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.pre<IUserDocument>("save", async function (next: Function) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password.toString(), 8);
  }

  next();
});

userSchema.pre<IUserDocument>("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  const isMatch = await bcrypt.compare(password, user.password.toString());

  if (!isMatch) {
    throw new Error("Login Failed!");
  }

  return user;
};

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, configs.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
