// backend/index.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const uploadRoutes = require("./routes/upload");
const manualsRoute = require("./routes/manuals");
const devRoutes = require("./routes/dev");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/manuals", manualsRoute);
app.use("/api/dev", devRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});
