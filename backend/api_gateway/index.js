import express from "express"
import cors from "cors"
import router from "./routes.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api", router)

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

app.listen(4000, () => console.log("Gateway running on :4000"))

export default app
