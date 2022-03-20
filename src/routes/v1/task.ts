import { Router } from "express";

import auth from "../../middleware/auth";
import {
  getTasks,
  getTask,
  postTask,
  updateTask,
  deleteTask,
} from "../../controllers/task";

const router = Router();

router.get("/", auth, getTasks);

router.get("/:id", auth, getTask);

router.post("/", auth, postTask);

router.patch("/:id", auth, updateTask);

router.delete("/:id", auth, deleteTask);

export default router;
