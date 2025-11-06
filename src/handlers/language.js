const BACK_MENU = {
  reply_markup: {
    keyboard: [["⬅️ Назад"], ["Головне меню"]],
    resize_keyboard: true,
  },
};

const LANGUAGE_MENU = {
  reply_markup: {
    keyboard: [["Українська", "English"], ["⬅️ Назад"], ["Головне меню"]],
    resize_keyboard: true,
  },
};

function register(bot) {
  bot.on("message", (msg) => {
    if (!msg.text) return;

    if (msg.text === "🌐 Змінити мову") {
      bot.sendMessage(msg.chat.id, "Оберіть мову інтерфейсу:", LANGUAGE_MENU);
      return;
    }

    if (msg.text === "Українська") {
      bot.sendMessage(
        msg.chat.id,
        "Мова встановлена: Українська 🇺🇦",
        BACK_MENU
      );
      return;
    }

    if (msg.text === "English") {
      bot.sendMessage(msg.chat.id, "Language set: English 🇬🇧", BACK_MENU);
      return;
    }
  });
}

module.exports = { register };
