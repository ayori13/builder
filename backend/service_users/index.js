import express from "express"
import cors from "cors"
import router from "./routes.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/users", router)

app.listen(4001, () => console.log("Users service running on :4001"))

export default app
