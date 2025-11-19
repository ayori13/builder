import express from 'express'
import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json())

let orders = []
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ success: false, error: "No token" })

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (e) {
    return res.status(401).json({ success: false, error: "Invalid token" })
  }
}

// CREATE ORDER
app.post('/v1/orders', auth, (req, res) => {
  const order = {
    id: orders.length + 1,
    userId: req.user.id,
    title: req.body.title,
    description: req.body.description || "",
    status: "created",
    createdAt: new Date()
  }

  orders.push(order)
  res.json({ success: true, data: order })
})

// GET USER ORDERS
app.get('/v1/orders', auth, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id)
  res.json({ success: true, data: userOrders })
})

// UPDATE STATUS
app.patch('/v1/orders/:id/status', auth, (req, res) => {
  const order = orders.find(o => o.id == req.params.id)
  if (!order) return res.status(404).json({ success: false, error: "Not found" })

  if (order.userId !== req.user.id)
    return res.status(403).json({ success: false, error: "Forbidden" })

  order.status = req.body.status
  res.json({ success: true, data: order })
})

export default app

if (process.env.NODE_ENV !== 'test') {
  app.listen(3002, () => console.log("Orders service running on 3002"))
}
