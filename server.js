import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import pdfRoutes from "./routes/pdf.js";
import userRoutes from "./routes/user.js";
import trackRoutes from "./routes/track.js";
import emailRoutes from "./routes/emailRoutes.js";
//import shareLinks from "./shareLinks.js";
import { getShareLink } from "./utils/shareStorage.js";
const app = express();
const PORT = 5000;
console.log("Email Users", process.env.EMAIL_USER);
console.log("Email Pass", process.env.EMAIL_PASS);
app.use(
  cors({
    origin: "http://localhost:5173"
  })
);
app.use(express.json());
app.use("/api", pdfRoutes);
app.use("/api", userRoutes);
app.use("/api", trackRoutes);
app.use("/api", emailRoutes);
app.get("/", (req, res) => {
  res.send("Server is working");
});
console.log("Track Routes Loaded");
console.log("Email Routes Loaded");
app.get("/share/:id", (req, res) => {
const shortId = req.params.id;
console.log("Short ID:", shortId);
//console.log("Available Link:", shareLinks);
const originalLink = getShareLink(shortId);
if (!originalLink) {
    return res.status(404).send("Invalid Share Link");
  }
  console.log("Redirecting to:", originalLink);
  res.redirect(302, originalLink);
});
app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
