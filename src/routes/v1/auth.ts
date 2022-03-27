import { Router } from "express";

import auth from "../../middleware/auth";
import { signUp, signIn, signOut, signOutAll } from "../../controllers/auth";
import upload from "../../middleware/multer";
import validateInputs from "../../validators";
import { signUpValidator, signInValidator } from "../../validators/auth";

const router = Router();

router
  .route("/signup")
  .post(validateInputs(signUpValidator()), upload.single("avatar"), signUp);

router.route("/signin").post(validateInputs(signInValidator()), signIn);

router.route("/signout").post(auth, signOut);

router.route("/signoutall").post(auth, signOutAll);

export default router;
