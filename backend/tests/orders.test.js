/* eslint-env jest */
const request = require("supertest");
const usersApp = require("../service_users/index");
const ordersApp = require("../service_orders/index");

describe("Orders service (интеграция с users)", () => {
  const email = `order_user_${Date.now()}@example.com`;
  const password = "secret123";
  let token = "";
  let orderId = "";

  // Сначала регистрируем пользователя и логинимся
  beforeAll(async () => {
    await request(usersApp)
      .post("/api/v1/users/register")
      .send({ email, password, name: "Order User" });

    const loginRes = await request(usersApp)
      .post("/api/v1/users/login")
      .send({ email, password });

    token = loginRes.body.data.token;
  });

  it("1. Создание заказа для авторизованного пользователя", async () => {
    const res = await request(ordersApp)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{ name: "Трубы", qty: 5 }],
        total: 1000
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("created");
    orderId = res.body.data.id;
  });

  it("2. Получение списка своих заказов", async () => {
    const res = await request(ordersApp)
      .get("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it("3. Получение конкретного своего заказа по id", async () => {
    const res = await request(ordersApp)
      .get(`/api/v1/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(orderId);
  });

  it("4. Обновление статуса заказа (отмена)", async () => {
    const res = await request(ordersApp)
      .patch(`/api/v1/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "cancelled" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("cancelled");
  });

  it("5. Доступ к заказам без токена даёт 401", async () => {
    const res = await request(ordersApp).get("/api/v1/orders");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
