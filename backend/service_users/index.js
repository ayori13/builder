const express = require("express");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const jwt = require("jsonwebtoken");
const { requestLogger } = require("../middleware/logger");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// База (файл JSON вместо БД)
const USERS_DB = path.join(__dirname, "users.json");
if (!fs.existsSync(USERS_DB)) fs.writeFileSync(USERS_DB, "[]");

// JWT ключ
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Утилиты
const loadUsers = () => JSON.parse(fs.readFileSync(USERS_DB, "utf8"));
const saveUsers = (users) => fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, roles: user.roles },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Миддлвар для проверки JWT
 */
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, error: "No token provided" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    req.logger.error({ msg: "Invalid token", error: e });
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
}

/**
 * Миддлвар проверки роли
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user.roles.includes(role))
      return res.status(403).json({ success: false, error: "Forbidden" });
    next();
  };
}

// ----------------------------
//         РЕГИСТРАЦИЯ
// ----------------------------
app.post("/api/v1/users/register", (req, res) => {
  const { email, password, name, roles } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, error: "Missing fields" });

  const users = loadUsers();

  if (users.find((u) => u.email === email))
    return res.status(409).json({ success: false, error: "User already exists" });

  const newUser = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    roles: roles || ["engineer"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  req.logger.info({ msg: "User registered", userId: newUser.id });

  res.json({ success: true, data: { id: newUser.id, email, roles: newUser.roles } });
});

// ----------------------------
//           ЛОГИН
// ----------------------------
app.post("/api/v1/users/login", (req, res) => {
  const { email, password } = req.body;

  const users = loadUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user)
    return res.status(401).json({ success: false, error: "Invalid credentials" });

  const token = createToken(user);

  req.logger.info({ msg: "User logged in", userId: user.id });

  res.json({ success: true, data: { token } });
});

// ----------------------------
//         МОЙ ПРОФИЛЬ
// ----------------------------
app.get("/api/v1/users/me", auth, (req, res) => {
  const users = loadUsers();
  const user = users.find((u) => u.id === req.user.id);

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      roles: user.roles,
      name: user.name
    }
  });
});

// ----------------------------
//     АДМИН: СПИСОК ПОЛЬЗОВАТЕЛЕЙ
// ----------------------------
app.get("/api/v1/users", auth, requireRole("admin"), (req, res) => {
  const users = loadUsers();

  res.json({ success: true, data: users });
});

module.exports = app;

