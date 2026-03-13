const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const multerErrorHandler = require("./common/middleware/multerErrorHandler");

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
app.use("/api/master/beasiswa", require("./features/beasiswa/route"));

app.use(
  "/api/master/lembaga-pendidikan",
  require("./features/lembaga-pendidikan/route"),
);

app.use("/api/master/sekolah", require("./features/sekolah/route"));

app.use("/api/master/pks", require("./features/pks/route"));

app.use("/api/master/bank", require("./features/bank/route"));

app.use(multerErrorHandler);

module.exports = app;
