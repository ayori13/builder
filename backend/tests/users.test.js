/* eslint-env jest */
const request = require("supertest");
const app = require("../service_users/index");

describe("Users service", () => {
  const email = `test_${Date.now()}@example.com`;
  const password = "secret123";
  let token = "";

  it("1. Успешная регистрация с валидными полями", async () => {
    const res = await request(app)
      .post("/api/v1/users/register")
      .send({ email, password, name: "Tester" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
  });

  it("2. Повторная регистрация с той же почтой возвращает контролируемую ошибку", async () => {
    const res = await request(app)
      .post("/api/v1/users/register")
      .send({ email, password, name: "Tester" });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("3. Вход с правильными данными выдаёт токен", async () => {
    const res = await request(app)
      .post("/api/v1/users/login")
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it("4. Доступ к защищённому пути без токена даёт 401", async () => {
    const res = await request(app).get("/api/v1/users/me");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("5. Профиль читается с токеном и содержит правильный email", async () => {
    const res = await request(app)
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(email);
  });
});
