const fs = require("fs");
const path = require("path");

const usersDB = path.join(__dirname, "../service_users/users.json");
const ordersDB = path.join(__dirname, "../service_orders/orders.json");

beforeAll(() => {
  console.log("⏳ Подготовка тестовой среды…");

  if (fs.existsSync(usersDB)) fs.writeFileSync(usersDB, "[]");
  if (fs.existsSync(ordersDB)) fs.writeFileSync(ordersDB, "[]");
});

afterAll(() => {
  console.log("🏁 Тестовая среда завершена");
});
