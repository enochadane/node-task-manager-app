import { body, check } from "express-validator";

export const signUpValidator = () => [
  check("email")
    .notEmpty()
    .withMessage("Email should not be empty.")
    .isEmail()
    .withMessage("Please, provide a valid email."),

  check("password")
    .notEmpty()
    .withMessage("Password should not be empty.")
    .isLength({ min: 8 })
    .withMessage("Password should not be less than 8 characters."),

  check("name")
    .notEmpty()
    .withMessage("Name should not be empty.")
    .isLength({ min: 4 })
    .withMessage("Name should not be less than 4 characters."),

  check("age")
    .notEmpty()
    .withMessage("Age should not be empty.")
    .isNumeric()
    .withMessage("Age should be a numeric value."),
];

export const signInValidator = () => [
  body("email")
    .notEmpty()
    .withMessage("Email should not be empty.")
    .isEmail()
    .withMessage("Please, provide a valid email."),

  check("password").notEmpty().withMessage("Password should not be empty."),
  console.log("signin validator running..."),
];
