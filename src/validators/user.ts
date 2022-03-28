import { check, param } from "express-validator";

export const idValidator = () => [
  param("id").isHexadecimal().withMessage("Id should be Object Id."),
];

export const updateUserValidator = () => [
  check("name")
    .optional()
    .isLength({ min: 4 })
    .withMessage("Name should not be less than 4 characters."),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Please, provide a valid email."),

  check("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password should not be less than 8 characters."),

  check("age").optional().isNumeric().withMessage("Age should be numeric."),
];
