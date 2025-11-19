import express from "express"
import cors from "cors"
import router from "./routes.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/orders", router)

app.listen(4002, () => console.log("Orders service running on :4002"))

export default app
