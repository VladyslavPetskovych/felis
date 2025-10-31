const TelegramBot = require("node-telegram-bot-api");

function createBot(token) {
  // polling: true — локальний варіант. На хостингу може бути webhook.
  const bot = new TelegramBot(token, { polling: true });

  // Місце для глобальних middleware чи логування, якщо потрібно
  bot.on("polling_error", (err) => console.error("Polling error", err));

  return bot;
}

module.exports = { createBot };
