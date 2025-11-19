import express from "express"
import axios from "axios"
import jwt from "jsonwebtoken"

const router = express.Router()
const JWT_SECRET = "supersecret"

// Проверка токена
function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ success: false, error: "No token" })

  const token = header.split(" ")[1]

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ success: false, error: "Invalid token" })
  }
}

// Пример проксирования
router.get("/orders", auth, async (req, res) => {
  const response = await axios.get("http://service_orders:4002/orders")
  res.json(response.data)
})

export default router
