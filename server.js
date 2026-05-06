import express from "express";
import cors from "cors";
import pdfRoutes from "./routes/pdf.js";
import userRoutes from "./routes/user.js";
import trackRoutes from "./routes/track.js"; 
const app = express();
const PORT = 5000;
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());
// Routes
app.use("/api", pdfRoutes);
app.use("/api", userRoutes);
app.use("/api", trackRoutes); 
app.get("/", (req, res) => {
  res.send("Server is working");
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
