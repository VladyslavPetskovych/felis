// src/commands/start.js
const MAIN_MENU = {
  reply_markup: {
    keyboard: [
      ["🍽 Меню", "🎁 Акції"],
      ["🚚 Доставка", "🌐 Змінити мову"],
      ["💬 Залишити відгук", "📞 Контакти"],
      ["🥗 Ланчі"],
    ],
    resize_keyboard: true,
  },
};

function register(bot) {
  bot.onText(/\/start/, (msg) => {
    const name = msg.from?.first_name || "Гість";
    bot.sendMessage(
      msg.chat.id,
      `Вітаємо, ${name}! 👋\nОберіть розділ:`,
      MAIN_MENU
    );
  });

  // опціонально — показ меню якщо натиснули кнопку "Головне меню"
  bot.on("message", (msg) => {
    if (!msg.text) return;
    if (msg.text === "Головне меню" || msg.text === "⬅️ Назад") {
      bot.sendMessage(msg.chat.id, "Повертаємось у меню:", MAIN_MENU);
    }
  });
}

module.exports = { register };
