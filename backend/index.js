// backend/index.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});
