import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const error = new Error(
      "Error: File upload only supports the following filetypes - pdf"
    );
    (error as any).code = "UNSUPPORTED_FILETYPE";
    cb(error);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export default upload;
