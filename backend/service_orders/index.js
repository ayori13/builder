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

// "База данных"
const ORDERS_DB = path.join(__dirname, "orders.json");
if (!fs.existsSync(ORDERS_DB)) fs.writeFileSync(ORDERS_DB, "[]");

// JWT
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Утилиты
const loadOrders = () => JSON.parse(fs.readFileSync(ORDERS_DB, "utf8"));
const saveOrders = (orders) => fs.writeFileSync(ORDERS_DB, JSON.stringify(orders, null, 2));

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

// ----------------------------
//     СОЗДАТЬ ЗАКАЗ
// ----------------------------
app.post("/api/v1/orders", auth, (req, res) => {
  const { items, total, status } = req.body;

  if (!items || !Array.isArray(items))
    return res.status(400).json({ success: false, error: "Invalid items" });

  const orders = loadOrders();

  const order = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    items,
    total: total || 0,
    status: status || "created",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(order);
  saveOrders(orders);

  req.logger.info({ msg: "Order created", orderId: order.id });

  res.json({ success: true, data: order });
});

// ----------------------------
//     ПОЛУЧИТЬ СВОЙ ЗАКАЗ
// ----------------------------
app.get("/api/v1/orders/:id", auth, (req, res) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === req.params.id);

  if (!order)
    return res.status(404).json({ success: false, error: "Not found" });

  if (order.userId !== req.user.id)
    return res.status(403).json({ success: false, error: "Forbidden" });

  res.json({ success: true, data: order });
});

// ----------------------------
//      СПИСОК МОИХ ЗАКАЗОВ
// ----------------------------
app.get("/api/v1/orders", auth, (req, res) => {
  const orders = loadOrders();
  const list = orders.filter((o) => o.userId === req.user.id);

  res.json({ success: true, data: list });
});

// ----------------------------
//   ОБНОВЛЕНИЕ СТАТУСА ЗАКАЗА
// ----------------------------
app.patch("/api/v1/orders/:id/status", auth, (req, res) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === req.params.id);

  if (!order)
    return res.status(404).json({ success: false, error: "Not found" });

  if (order.userId !== req.user.id)
    return res.status(403).json({ success: false, error: "Forbidden" });

  const { status } = req.body;
  const allowed = ["created", "in_progress", "done", "cancelled"];

  if (!allowed.includes(status))
    return res.status(400).json({ success: false, error: "Invalid status" });

  order.status = status;
  order.updatedAt = new Date().toISOString();

  saveOrders(orders);

  req.logger.info({ msg: "Order status changed", orderId: order.id, status });

  res.json({ success: true, data: order });
});

// ----------------------------
//      ОТМЕНА ЗАКАЗА
// ----------------------------
app.delete("/api/v1/orders/:id", auth, (req, res) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === req.params.id);

  if (!order)
    return res.status(404).json({ success: false, error: "Not found" });

  if (order.userId !== req.user.id)
    return res.status(403).json({ success: false, error: "Forbidden" });

  order.status = "cancelled";
  order.updatedAt = new Date().toISOString();

  saveOrders(orders);

  req.logger.info({ msg: "Order cancelled", orderId: order.id });

  res.json({ success: true, data: order });
});


module.exports = app;
