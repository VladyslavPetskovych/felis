const TelegramBot = require("node-telegram-bot-api");

function createBot(token) {
  const bot = new TelegramBot(token, { polling: true });
  bot.on("polling_error", (err) => console.error("Polling error", err));
  return bot;
}

module.exports = { createBot };


