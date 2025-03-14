
const express =require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req:any, res:any) => {
  res.send("Server Çalışıyor!");
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor http://localhost:${PORT}`);
});
