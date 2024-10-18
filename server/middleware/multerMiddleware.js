import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../images");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Provide the upload path to multer callback
    cb(null, uploadPath);
  },

  // Set the filename to be unique by appending a timestamp to the original name
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${file.originalname}`;

    // Return the generated file name to the callback
    cb(null, uniqueFileName);
  },
});

// Export the configured multer instance
export const upload = multer({
  storage,
  // File size limit (optional, set to 5MB as an example)
  limits: { fileSize: 5 * 1024 * 1024 },

  // File filter to control allowed file types (example for images)
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png, gif) are allowed!"));
    }
  },
});
