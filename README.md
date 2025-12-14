# Raja Mantri Chor Sipahi – Backend

Backend implementation of the classic **Raja–Mantri–Chor–Sipahi** game using **Node.js** and **Express**.  
The game is fully playable via **Postman** (no frontend required).

---

## 🎮 Game Overview

Four players join a room and are randomly assigned roles:

- **Raja** – Observer (highest points)
- **Mantri** – Must guess the Chor
- **Chor** – Avoid getting caught
- **Sipahi** – Wait for result

The Mantri guesses who the Chor is.  
Scores are assigned based on whether the guess is correct.

---

## 🧠 Rules & Scoring

| Role     | Default Points |
|---------|----------------|
| Raja    | 1000           |
| Mantri | 800            |
| Sipahi | 500            |
| Chor   | 0              |

### Guess Logic
- ✅ **Correct Guess** → Raja, Mantri, Sipahi keep their points
- ❌ **Wrong Guess** → Chor steals points

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- In-memory storage (no database)
- Postman for testing APIs

---

## 📦 Installation & Run

```bash
git clone https://github.com/ishita030106/raja-mantri-backend.git
cd raja-mantri-backend
npm install
node index.js
