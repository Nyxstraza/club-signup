// Local backend for the club sign-up app.
// Uses Node's built-in SQLite (node:sqlite, stable since Node 22.13 — no
// native module to compile, no extra tools to install). Stores
// registrations in club.db, a file that lives right next to this script.

const express = require("express");
const cors = require("cors");
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

// Bare-minimum admin auth for a school project — hardcoded credentials,
// no sessions/tokens. Replace with real auth before using this for real.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const app = express();
app.use(cors());
app.use(express.json());

const db = new DatabaseSync(path.join(__dirname, "club.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    middleInitial TEXT,
    gender TEXT NOT NULL,
    birthday TEXT NOT NULL,
    course TEXT NOT NULL,
    section TEXT NOT NULL,
    club TEXT NOT NULL,
    registeredAt TEXT NOT NULL
  )
`);

const REQUIRED_FIELDS = [
  "username", "email", "firstName", "lastName",
  "gender", "birthday", "course", "section", "club",
];

// Create a registration. Note: the password is validated on the client but
// intentionally never sent here — this app has no login for members, only
// for the admin, so there's nothing to store a password for.
app.post("/api/members", (req, res) => {
  const data = req.body || {};
  const missing = REQUIRED_FIELDS.filter((field) => !String(data[field] || "").trim());
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required field(s): ${missing.join(", ")}` });
  }

  const registeredAt = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO members (username, email, firstName, lastName, middleInitial, gender, birthday, course, section, club, registeredAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    data.username,
    data.email,
    data.firstName,
    data.lastName,
    data.middleInitial || "",
    data.gender,
    data.birthday,
    data.course,
    data.section,
    data.club,
    registeredAt
  );

  const member = db.prepare("SELECT * FROM members WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(member);
});

// List all registrations (used by the admin dashboard).
app.get("/api/members", (req, res) => {
  const members = db.prepare("SELECT * FROM members ORDER BY id DESC").all();
  res.json(members);
});

// Remove a registration.
app.delete("/api/members/:id", (req, res) => {
  const info = db.prepare("DELETE FROM members WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Member not found." });
  res.status(204).end();
});

// Admin login check. Simple boolean response — no token, matching the
// bare-minimum scope of the rest of this project.
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Club sign-up API running on http://localhost:${PORT}`);
  console.log(`SQLite database: ${path.join(__dirname, "club.db")}`);
});
