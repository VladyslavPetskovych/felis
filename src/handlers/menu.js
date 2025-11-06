const BACK_MENU = {
  reply_markup: {
    keyboard: [["⬅️ Назад"], ["Головне меню"]],
    resize_keyboard: true,
  },
};

function register(bot) {
  bot.on("message", (msg) => {
    if (!msg.text) return;
    if (msg.text === "🍽 Меню") {
      bot.sendMessage(
        msg.chat.id,
        "Ось наше меню 🍽\n(Тут буде список категорій або посилання на меню)",
        BACK_MENU
      );
    }
  });
}

module.exports = { register };
