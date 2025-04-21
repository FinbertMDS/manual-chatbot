const express = require("express");
const router = express.Router();
const multer = require("multer");
const { processManual } = require("../services/embedding");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("manual"), async (req, res) => {
  await processManual(req.file.path);
  res.sendStatus(200);
});

module.exports = router;
