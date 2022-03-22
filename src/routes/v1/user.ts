import { Router } from "express";

import auth from "../../middleware/auth";
import {
  viewProfile,
  getUser,
  updateUser,
  deleteUser,
  deleteImage,
  getImage,
} from "../../controllers/user";

const router = Router();

router.get("/me", auth, viewProfile);

router.get("/:id", getUser);

router.patch("/me", auth, updateUser);

router.delete("/me", auth, deleteUser);

// router.post(
//   "/me/avatar",
//   auth,
//   upload.single("avatar"),
//   uploadImage,
//   (error, req, res, next) => {
//     res.status(400).send(error.message);
//   }
// );

router.get("/me/avatar", auth, getImage);

router.delete("/me/avatar", auth, deleteImage);

export default router;
