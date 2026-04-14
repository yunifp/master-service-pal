const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const multerErrorHandler = require("./common/middleware/multerErrorHandler");
const checkAuthorization = require("./common/middleware/auth_middleware");

const app = express();
app.set("trust proxy", true);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/uploads", express.static(process.env.FILE_URL || "E:/upload_palma"));

app.use("/api/master/wilayah", require("./features/wilayah/route"));

app.use(
  "/api/master/perguruan-tinggi",
  require("./features/perguruan-tinggi/route"),
);

app.use("/api/master/program-studi", require("./features/program-studi/route"));

app.use("/api/master/beasiswa", require("./features/beasiswa/route"));
app.use("/api/master/setting-jurusan-prodi", require("./features/setting-jurusan-prodi/route"));
app.use(
  "/api/master/lembaga-pendidikan",
  require("./features/lembaga-pendidikan/route"),
);

app.use("/api/master/sekolah", require("./features/sekolah/route"));

app.use("/api/master/pks", require("./features/pks/route"));
app.use("/api/master/npsn", require("./features/npsn/route"));

app.use("/api/master/bank", require("./features/bank/route"));

app.use(
  "/api/master/dashboard",
  checkAuthorization,
  require("./features/dashboard/route")
);

app.use(
  "/api/master/referensi-wilayah",
  checkAuthorization,
  require("./features/referensi-wilayah/route")
);

app.use(
  "/api/master/wilayah-khusus",
  checkAuthorization,
  require("./features/wilayah-khusus/route")
);

app.use(
  "/api/master/agama",
  checkAuthorization,
  require("./features/agama/route")
);

app.use(
  "/api/master/pekerjaan",
  checkAuthorization,
  require("./features/pekerjaan/route")
);

app.use("/api/master/jalur", checkAuthorization, require("./features/jalur/route"));
app.use("/api/master/suku", checkAuthorization, require("./features/suku/route"));
app.use("/api/master/dokumen-umum", checkAuthorization, require("./features/dokumen-umum/route"));
app.use("/api/master/dokumen-khusus", checkAuthorization, require("./features/dokumen-khusus/route"));

app.use(
  "/api/master/penghasilan",
  checkAuthorization,
  require("./features/penghasilan/route")
);
// app.use("/api/master/cms", checkAuthorization, require("./features/landingpage/route"));
// Publik — khusus GET landing page (tanpa auth)
app.use("/api/master/cms", require("./features/landingpage/route"));

// HAPUS baris lama ini:
// app.use("/api/master/cms", checkAuthorization, require("./features/landingpage/route"));
app.use(multerErrorHandler);

module.exports = app;