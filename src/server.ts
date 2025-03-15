import connectDB from "./database";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import todoRoutes from "./routers/todo_router";
import express from "express";
import path from "path";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.static(path.join(__dirname, "../public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
  res.render("todo");
})

connectDB();

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor http://localhost:${PORT}`);
});
