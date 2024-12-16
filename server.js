const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://boat-blond.vercel.app", // URL do frontend
    methods: ["GET", "POST"],
  },
});

let leaderboard = [];

io.on("connection", (socket) => {
  console.log("Novo jogador conectado!");

  socket.on("gameCompleted", ({ nickname, time }) => {
    leaderboard.push({ nickname, time });
    leaderboard.sort((a, b) => a.time - b.time);

    // Envia o ranking atualizado para todos
    io.emit("updateLeaderboard", leaderboard);
  });

  socket.on("disconnect", () => {
    console.log("Jogador desconectado!");
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
