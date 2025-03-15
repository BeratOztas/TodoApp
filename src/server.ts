import connectDB from "./database";
import dotenv from "dotenv";
import cors from "cors";
import todoRoutes from "./routers/todo_router";
import express from "express";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

connectDB();

app.use("/todos",todoRoutes);

app.get("/", (req:any, res:any) => {
  res.send("Server Çalışıyor!");
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor http://localhost:${PORT}`);
});
