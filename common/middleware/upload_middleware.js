const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { S3Client, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const baseUploadDir = process.env.FILE_URL || "D:/upload_palma";
const storageType = process.env.DATABASE_PENYIMPANAN || "biasa";

// Bucket S3
const UPLOAD_BUCKET = process.env.S3_BUCKET_NAME;
const DOWNLOAD_BUCKET = process.env.S3_DOWNLOAD_BUCKET_NAME || UPLOAD_BUCKET;

let s3Client = null;

if (storageType === "s3") {
  s3Client = new S3Client({
    region: process.env.S3_REGION || "wjv-1",
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true, // WAJIB TRUE untuk Biznet NOS
  });
}

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Fungsi generate path S3 khusus untuk CMS/Master
const generateS3Path = (folderName, rawName) => {
  const tahun = new Date().getFullYear();
  // Kita jadikan satu folder khusus MASTER_CMS di dalam Bucket
  return `${tahun}/MASTER_CMS/${folderName}/${rawName}`;
};

// Storage configuration (Dynamic antara Local vs S3)
const createStorage = (folderName) => {
  if (storageType === "s3") {
    return multerS3({
      s3: s3Client,
      bucket: UPLOAD_BUCKET,
      contentType: (req, file, cb) => {
        cb(null, file.mimetype);
      },
      key: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1e6);

        let prefix = "file";
        switch (folderName) {
          case "logo_perguruan_tinggi": prefix = "logo-pt"; break;
          case "cms_hero": prefix = "hero"; break;
          case "cms_jalur": prefix = "jalur"; break;
          case "cms_tentang": prefix = "tentang"; break;
        }

        const rawName = `${prefix}-${timestamp}-${random}${ext}`;
        const finalPath = generateS3Path(folderName, rawName);
        
        // Simpan key S3 ke file.filename agar compatible dengan controller yang lama
        file.filename = finalPath; 
        cb(null, finalPath);
      },
    });
  }

  // Storage lokal
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

      let prefix = "file";
      switch (folderName) {
        case "logo_perguruan_tinggi": prefix = "logo-pt"; break;
        case "cms_hero": prefix = "hero"; break;
        case "cms_jalur": prefix = "jalur"; break;
        case "cms_tentang": prefix = "tentang"; break;
      }

      cb(null, `${prefix}-${timestamp}-${random}${ext}`);
    },
  });
};

const createFileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      const typeNames = allowedTypes
        .map((type) => {
          switch (type) {
            case "image/jpeg": return "JPG";
            case "image/png": return "PNG";
            case "image/webp": return "WEBP";
            case "image/svg+xml": return "SVG";
            case "application/pdf": return "PDF";
            case "application/msword": return "DOC";
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": return "DOCX";
            default: return type;
          }
        })
        .join(", ");

      const error = new Error(`Format file harus ${typeNames}`);
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }
    cb(null, true);
  };
};

const imageAllowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

const uploadConfigs = {
  logo_perguruan_tinggi: multer({
    storage: createStorage("logo_perguruan_tinggi"),
    fileFilter: createFileFilter(imageAllowedTypes),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }),
  cms_hero: multer({
    storage: createStorage("cms_hero"),
    fileFilter: createFileFilter(imageAllowedTypes),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }),
  cms_jalur: multer({
    storage: createStorage("cms_jalur"),
    fileFilter: createFileFilter(imageAllowedTypes),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }),
  cms_tentang: multer({
    storage: createStorage("cms_tentang"),
    fileFilter: createFileFilter(imageAllowedTypes),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }),
};

// === FUNGSI PROXY PUBLIK UNTUK AKSES GAMBAR ===
// Mengambil file Private dari S3 (menggunakan Secret Key di backend) lalu merendernya ke publik
const servePublicFileProxy = async (req, res) => {
  const { folder, file } = req.query;

  if (!file) return res.status(400).send("File wajib diisi");

  try {
    if (storageType === "s3") {
      const fileKey = file.includes("/") ? file : `${folder}/${file}`;
      
      const command = new GetObjectCommand({
        Bucket: DOWNLOAD_BUCKET, 
        Key: fileKey,
      });

      if (!s3Client) {
        s3Client = new S3Client({
          region: process.env.S3_REGION || "wjv-1", 
          endpoint: process.env.S3_ENDPOINT || undefined, 
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
          },
          forcePathStyle: true,
        });
      }

      const response = await s3Client.send(command);

      res.setHeader("Content-Type", response.ContentType);
      res.setHeader("Cache-Control", "public, max-age=86400"); // Cache browser 1 hari
      if (response.ContentLength) res.setHeader("Content-Length", response.ContentLength);

      response.Body.pipe(res);
    } else {
      const filePath = path.join(baseUploadDir, folder || "", file);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send("File lokal tidak ditemukan");
      }
    }
  } catch (error) {
    console.error("Proxy Error:", error.message);
    res.status(404).send("Gagal memuat file");
  }
};

const getFileUrl = (req, folderName, filename) => {
  if (!filename) return null;
  // Pastikan baseUrl mengambil root domain/host
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

  if (storageType === "s3") {
    // KITA KEMBALI MENGGUNAKAN PROXY BACKEND KARENA BUCKET S3 PRIVATE
    const encodedFilename = encodeURIComponent(filename);
    const encodedFolder = encodeURIComponent(folderName);
    
    // 🚀 PERBAIKAN: Menyesuaikan path dengan index.js -> /api/master/cms/...
    return `${baseUrl}/api/master/cms/files/public?folder=${encodedFolder}&file=${encodedFilename}`;
  }

  // Storage lokal
  return `${baseUrl}/uploads/${folderName}/${filename}`;
};

const deleteFile = async (folderName, filename) => {
  if (!filename) return false;
  
  if (storageType === "s3") {
    const fileKey = filename.includes("/") ? filename : `${folderName}/${filename}`;
    const command = new DeleteObjectCommand({
      Bucket: UPLOAD_BUCKET,
      Key: fileKey,
    });
    try {
      await s3Client.send(command); 
      return true;
    } catch (error) {
      console.error("Gagal hapus file S3:", error);
      return false;
    }
  } else {
    const filePath = path.join(baseUploadDir, folderName, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
};

module.exports = {
  uploadConfigs,
  getFileUrl,
  deleteFile,
  ensureDirectoryExists,
  baseUploadDir,
  servePublicFileProxy,
};