import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router()
const JWT_SECRET = "supersecret"

const users = []

// РЕГИСТРАЦИЯ
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body

  if (!email || !password || !role)
    return res.status(400).json({ success: false, error: "Missing fields" })

  const hashed = await bcrypt.hash(password, 10)
  const user = { id: Date.now(), email, password: hashed, role }
  users.push(user)

  res.status(201).json({ success: true, user })
})

// ЛОГИН
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email)

  if (!user) return res.status(404).json({ success: false, error: "User not found" })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ success: false, error: "Wrong password" })

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "2h" })
  res.json({ success: true, token })
})

export default router
