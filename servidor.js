const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

console.log("Servindo arquivos da pasta:", path.join(__dirname, "f4"));
app.use(express.static(path.join(__dirname, "f4")));

let currentActive = 1;

io.on("connection", (socket) => {
  console.log("Novo PC conectado");
  
  setTimeout(() => {
    socket.emit("activate", { next: currentActive });
  }, 2000);

  socket.on("done", (data) => {
    console.log(`✅ PC${data.id} finalizado!`);
    if (data.id === currentActive && data.id < 6) {
      currentActive++;
      console.log(`➡️ Ativando PC${currentActive}`);
      io.emit("activate", { next: currentActive });
    }
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Servidor rodando em http://0.0.0.0:3000");
});
