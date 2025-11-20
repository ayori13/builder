import express from "express"

const router = express.Router()

const orders = []

// СОЗДАТЬ ДЕФЕКТ
router.post("/", (req, res) => {
  const { title, description, priority } = req.body

  if (!title) return res.status(400).json({ success: false, error: "Missing title" })

  const order = {
    id: Date.now(),
    title,
    description,
    priority,
    status: "new"
  }

  orders.push(order)
  res.status(201).json({ success: true, order })
})

// СПИСОК ДЕФЕКТОВ
router.get("/", (req, res) => {
  res.json({ success: true, orders })
})

export default router
