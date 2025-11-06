require("dotenv").config();
const { createBot } = require("./bot");

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN не знайдено у .env");
  process.exit(1);
}

const bot = createBot(token);

let startHandler = require("./src/commands/start");
console.log("DEBUG raw startHandler ->", startHandler);

if (startHandler && startHandler.default) startHandler = startHandler.default;

if (typeof startHandler === "function") {
  startHandler = { register: startHandler };
}

if (!startHandler || typeof startHandler.register !== "function") {
  console.error(
    "❌ startHandler не має методу register. Перевір src/commands/start.js"
  );
  process.exit(1);
}

startHandler.register(bot);

// Register start menu button handlers
const handlers = require("./src/handlers");
if (!handlers || typeof handlers.register !== "function") {
  console.error("❌ Не вдалося підключити handlers з src/handlers");
  process.exit(1);
}
handlers.register(bot);

console.log("✅ Додаток запущено, start handler підключений.");
