import { check, param } from "express-validator";

export const idValidator = () => [
  param("id").isHexadecimal().withMessage("Id should be Object Id."),
];

export const updateUserValidator = () => [
  check("name")
    .isLength({ min: 4 })
    .withMessage("Name should not be less than 4 characters."),

  check("email").isEmail().withMessage("Please, provide a valid email."),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should not be less than 8 characters."),

  check("age").isNumeric().withMessage("Age should be numeric."),
];
