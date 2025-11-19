import request from "supertest"
import gateway from "../api_gateway/index.js"

describe("Gateway integration", () => {

  it("Маршрут: GET /api/health", async () => {
    const res = await request(gateway).get("/api/health")
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
  })

})
