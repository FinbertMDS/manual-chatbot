const express = require("express");
const multer = require("multer");
const chatRoutes = require("./routes/chat");
const uploadRoutes = require("./routes/upload");

const app = express();
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(3001, () => console.log("Server running on port 3001"));
