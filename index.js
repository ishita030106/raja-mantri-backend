const express = require("express");
const app = express();

app.use(express.json());

// =====================
// In-memory storage
// =====================
const rooms = {};

// =====================
// 1️⃣ Create Room
// =====================
app.post("/room/create", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Player name is required" });
  }

  const roomId = Math.floor(100000 + Math.random() * 900000).toString();
  const playerId = Date.now().toString();

  rooms[roomId] = {
    players: [{ playerId, name }],
    roles: {},
    scores: {}
  };

  res.json({
    message: "Room created",
    roomId,
    playerId
  });
});

// =====================
// 2️⃣ Join Room
// =====================
app.post("/room/join", (req, res) => {
  const { roomId, name } = req.body;

  if (!roomId || !name) {
    return res.status(400).json({ error: "roomId and name required" });
  }

  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  if (room.players.length >= 4) {
    return res.status(400).json({ error: "Room is full" });
  }

  const playerId = Date.now().toString();
  room.players.push({ playerId, name });

  res.json({
    message: "Joined room",
    playerId
  });
});

// =====================
// 3️⃣ Assign Roles
// =====================
app.post("/room/assign/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = rooms[roomId];

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  if (room.players.length !== 4) {
    return res.status(400).json({ error: "Exactly 4 players required" });
  }

  const roles = ["Raja", "Mantri", "Chor", "Sipahi"];
  roles.sort(() => Math.random() - 0.5);

  room.players.forEach((player, index) => {
    room.roles[player.playerId] = roles[index];
    room.scores[player.playerId] = 0;
  });

  res.json({ message: "Roles assigned" });
});

// =====================
// 4️⃣ View My Role
// =====================
app.get("/role/me/:roomId/:playerId", (req, res) => {
  const { roomId, playerId } = req.params;
  const room = rooms[roomId];

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const role = room.roles[playerId];
  if (!role) {
    return res.status(404).json({ error: "Role not found" });
  }

  res.json({ role });
});

// =====================
// 5️⃣ Guess Chor (Mantri)
// =====================
app.post("/guess/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { guessedPlayerId } = req.body;

  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const chorId = Object.keys(room.roles).find(
    id => room.roles[id] === "Chor"
  );

  if (!chorId) {
    return res.status(400).json({ error: "Roles not assigned yet" });
  }

  if (guessedPlayerId === chorId) {
    // Correct guess
    room.players.forEach(p => {
      if (room.roles[p.playerId] === "Raja") room.scores[p.playerId] += 1000;
      if (room.roles[p.playerId] === "Mantri") room.scores[p.playerId] += 800;
      if (room.roles[p.playerId] === "Sipahi") room.scores[p.playerId] += 500;
    });
  } else {
    // Wrong guess → Chor escapes
    room.scores[chorId] += 800;
  }

  res.json({ message: "Guess processed" });
});

// =====================
// 6️⃣ Final Result
// =====================
app.get("/result/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = rooms[roomId];

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json({
    players: room.players,
    roles: room.roles,
    scores: room.scores
  });
});

// =====================
// 7️⃣ Leaderboard
// =====================
app.get("/leaderboard/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = rooms[roomId];

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json(room.scores);
});

// =====================
// 🚀 Start Server (MUST BE LAST)
// =====================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
