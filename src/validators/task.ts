import { body, param } from "express-validator";

export const idValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("Id should be passed as params")
    .isMongoId()
    .withMessage("Invalid Object Id."),
];

export const postTaskValidator = () => [
  body("description")
    .notEmpty()
    .withMessage("description should not be empty.")
    .isString()
    .withMessage("description should be string."),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("completed should be boolean."),
];

export const updateTaskValidator = () => [
  body("description").optional().isString().withMessage("description should be string."),

  body("completed").optional().isBoolean().withMessage("completed should be boolean."),
];
