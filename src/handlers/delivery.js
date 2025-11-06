const BACK_MENU = {
  reply_markup: {
    keyboard: [["⬅️ Назад"], ["Головне меню"]],
    resize_keyboard: true,
  },
};

function register(bot) {
  bot.on("message", (msg) => {
    if (!msg.text) return;
    if (msg.text === "🚚 Доставка") {
      bot.sendMessage(
        msg.chat.id,
        "Умови доставки 🚚\n— Час: 10:00–21:00\n— Вартість: від 60 грн (залежно від району)\n— Самовивіз: безкоштовно",
        BACK_MENU
      );
    }
  });
}

module.exports = { register };
