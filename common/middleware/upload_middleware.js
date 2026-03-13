const multer = require("multer");
const path = require("path");
const fs = require("fs");

const baseUploadDir = process.env.FILE_URL;

// Fungsi untuk membuat folder jika belum ada
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage configuration dengan dynamic folder
const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(baseUploadDir, folderName);
      ensureDirectoryExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1e6);

      // Nama file berdasarkan folder type
      let prefix = "file";
      switch (folderName) {
        case "logo_perguruan_tinggi":
          prefix = "logo-pt";
          break;
      }

      const filename = `${prefix}-${timestamp}-${random}${ext}`;
      cb(null, filename);
    },
  });
};

// File filter untuk berbagai jenis file
const createFileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      const typeNames = allowedTypes
        .map((type) => {
          switch (type) {
            case "image/jpeg":
              return "JPG";
            case "image/png":
              return "PNG";
            case "image/svg+xml":
              return "SVG";
            case "application/pdf":
              return "PDF";
            case "application/msword":
              return "DOC";
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              return "DOCX";
            default:
              return type;
          }
        })
        .join(", ");

      // 🚨 Buat error dengan kode khusus
      const error = new Error(`Format file harus ${typeNames}`);
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }

    cb(null, true);
  };
};

// Predefined upload configurations
const uploadConfigs = {
  logo_perguruan_tinggi: multer({
    storage: createStorage("logo_perguruan_tinggi"),
    fileFilter: createFileFilter([
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ]),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }),
};

// Helper function untuk mendapatkan URL file
const getFileUrl = (req, folderName, filename) => {
  const baseUrl =
    process.env.BASE_URL || `${req.protocol}://${req.get("host")}/backend`;

  return `${baseUrl}/uploads/${folderName}/${filename}`;
};

// Helper function untuk menghapus file
const deleteFile = (folderName, filename) => {
  const filePath = path.join(baseUploadDir, folderName, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

module.exports = {
  uploadConfigs,
  getFileUrl,
  deleteFile,
  ensureDirectoryExists,
  baseUploadDir,
};
