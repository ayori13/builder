import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json())

const users = []

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

// REGISTER
app.post('/v1/users/register', async (req, res) => {
  const { email, password, name } = req.body

  const exists = users.find(u => u.email === email)
  if (exists) return res.status(400).json({ success: false, error: "User exists" })

  const hashed = await bcrypt.hash(password, 10)

  const user = {
    id: users.length + 1,
    email,
    name,
    password: hashed,
    roles: ['engineer'],
  }

  users.push(user)

  res.json({ success: true, data: { id: user.id } })
})

// LOGIN
app.post('/v1/users/login', async (req, res) => {
  const { email, password } = req.body

  const user = users.find(u => u.email === email)
  if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ success: false, error: "Invalid credentials" })

  const token = jwt.sign({ id: user.id, roles: user.roles }, JWT_SECRET)

  res.json({
    success: true,
    data: { token, user }
  })
})

// Export for tests
export default app

if (process.env.NODE_ENV !== 'test') {
  app.listen(3001, () => console.log("Users service running on 3001"))
}
