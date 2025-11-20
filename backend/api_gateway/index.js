const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { requestLogger } = require("../middleware/logger");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// 🔥 rate-limit
app.use(
  rateLimit({
    windowMs: 10 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false
  })
);

// -------------------------------
// USERS → сервис пользователей
// -------------------------------
app.use("/api/v1/users", async (req, res) => {
  const target = `http://service_users:4001${req.url}`;

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
        "x-request-id": req.id
      },
      body: ["POST", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    req.logger.error({ msg: "User service error", error: e });
    res.status(500).json({ success: false, error: "User service unavailable" });
  }
});

// -------------------------------
// ORDERS → сервис заказов
// -------------------------------
app.use("/api/v1/orders", async (req, res) => {
  const target = `http://service_orders:4002${req.url}`;

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
        "x-request-id": req.id
      },
      body: ["POST", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    req.logger.error({ msg: "Order service error", error: e });
    res.status(500).json({ success: false, error: "Order service unavailable" });
  }
});

module.exports = app;
