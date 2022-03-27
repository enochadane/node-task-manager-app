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

import validateInputs from "../../validators";
import { idValidator, updateUserValidator } from "../../validators/user";

const router = Router();

router
  .route("/me")
  .get(auth, viewProfile)
  .patch(auth, validateInputs(updateUserValidator()), updateUser)
  .delete(auth, deleteUser);

router.route("/:id").get(auth, validateInputs(idValidator()), getUser);

// router.post(
//   "/me/avatar",
//   auth,
//   upload.single("avatar"),
//   uploadImage,
//   (error, req, res, next) => {
//     res.status(400).send(error.message);
//   }
// );

router.route("/me/avatar")
  .get(auth, getImage)
  .delete(auth, deleteImage);

export default router;
