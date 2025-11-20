const app = require("./index");

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log("Orders service running on", PORT);
});
