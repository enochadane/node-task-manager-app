import { Router } from "express";

import auth from "../../middleware/auth";
import { signUp, signIn, signOut, signOutAll } from "../../controllers/auth";
import upload from "../../middleware/multer";

const router = Router();

router.post("/signUp", upload.single("avatar"), signUp);

router.post("/signIn", signIn);

router.post("/signOut", auth, signOut);

router.post("/signOutAll", auth, signOutAll);

export default router;
