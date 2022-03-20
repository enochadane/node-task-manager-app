import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import configs from "../config/config";
import User from "../models/user";

const auth = async (req, res, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded: any = jwt.verify(token, configs.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
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
