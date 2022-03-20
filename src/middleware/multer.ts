import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (_req: Request, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Please upload an Image!"));
  }

  cb(undefined, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter,
});

export default upload;
