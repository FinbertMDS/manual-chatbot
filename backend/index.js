// backend/index.js

require("dotenv").config();
console.log("🔑 OPENAI_API_KEY =", process.env.OPENAI_API_KEY);

const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});
