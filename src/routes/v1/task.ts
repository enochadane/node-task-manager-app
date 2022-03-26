import { Router } from "express";

import auth from "../../middleware/auth";
import {
  getTasks,
  getTask,
  postTask,
  updateTask,
  deleteTask,
} from "../../controllers/task";

import validateInputs from "../../validators";
import {
  idValidator,
  postTaskValidator,
  updateTaskValidator,
} from "../../validators/task";

const router = Router();

router.route("/").get(auth, getTasks);

router.route("/:id").get(auth, validateInputs(idValidator), getTask);

router.route("/").post(auth, validateInputs(postTaskValidator), postTask);

router
  .route("/:id")
  .patch(
    auth,
    validateInputs(idValidator),
    validateInputs(updateTaskValidator),
    updateTask
  );

router.route("/:id").delete(auth, validateInputs(idValidator), deleteTask);

export default router;
