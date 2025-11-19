import express from 'express'
import cors from 'cors'
import proxy from 'express-http-proxy'
import { v4 as uuid } from 'uuid'

const app = express()
app.use(express.json())
app.use(cors())

// X-Request-ID middleware
app.use((req, res, next) => {
  req.headers['x-request-id'] = uuid()
  next()
})

// Proxy to services
const USERS_URL = process.env.USERS_URL || 'http://localhost:3001'
const ORDERS_URL = process.env.ORDERS_URL || 'http://localhost:3002'

app.use('/v1/users', proxy(USERS_URL))
app.use('/v1/orders', proxy(ORDERS_URL))

// Export app for tests
export default app

// Start server IF not running under tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(8080, () => console.log('API Gateway running on 8080'))
}
