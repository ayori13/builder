import request from "supertest"
import users from "../service_users/index.js"
import orders from "../service_orders/index.js"

let token = ""

describe("Auth + Orders integration", () => {

  it("Регистрация + логин", async () => {
    await request(users)
      .post("/users/register")
      .send({
        email: "int@test.com",
        password: "123",
        role: "manager"
      })

    const loginRes = await request(users)
      .post("/users/login")
      .send({
        email: "int@test.com",
        password: "123"
      })

    expect(loginRes.status).toBe(200)
    token = loginRes.body.token
    expect(token).toBeDefined()
  })

  it("Создание дефекта через токен", async () => {
    const res = await request(orders)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Интеграционный дефект",
        description: "Тест",
        priority: "low"
      })

    expect(res.status).toBe(201)
  })

})
