const { storage, normalizePhone } = require("../utils/storage");

const BACK_MENU = {
  reply_markup: {
    keyboard: [["⬅️ Назад"], ["Головне меню"]],
    resize_keyboard: true,
  },
};

function requestContactKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        [
          {
            text: "📱 Поділитись номером",
            request_contact: true,
          },
        ],
        ["⬅️ Назад"],
        ["Головне меню"],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function buildSavedMessage(user) {
  const who = user.name || user.username || user.chatId;
  return `Дякуємо, ${who}! ✅\nЗберегли ваш номер: ${user.phone}`;
}

function register(bot) {
  bot.on("message", async (msg) => {
    const text = msg.text || "";

    if (text === "/phone" || text === "📱 Залишити номер") {
      bot.sendMessage(
        msg.chat.id,
        "Надішліть номер телефону, або натисніть кнопку нижче:",
        requestContactKeyboard()
      );
      return;
    }

    if (msg.contact && msg.contact.user_id === msg.from.id) {
      const phone = msg.contact.phone_number;
      const normalized = normalizePhone(phone);
      if (!normalized) {
        bot.sendMessage(
          msg.chat.id,
          "Не вдалося розпізнати номер. Введіть, будь ласка, у форматі +380XXXXXXXXX.",
          BACK_MENU
        );
        return;
      }
      const user = await storage.saveUserPhone({
        chatId: msg.chat.id,
        phone: normalized,
        name: msg.from.first_name || "",
        username: msg.from.username || "",
      });
      bot.sendMessage(msg.chat.id, buildSavedMessage(user), BACK_MENU);
      return;
    }

    if (text.startsWith("+") || /\d/.test(text)) {
      const normalized = normalizePhone(text);
      if (!normalized) return; // ignore random numeric messages
      const user = await storage.saveUserPhone({
        chatId: msg.chat.id,
        phone: normalized,
        name: msg.from.first_name || "",
        username: msg.from.username || "",
      });
      bot.sendMessage(msg.chat.id, buildSavedMessage(user), BACK_MENU);
      return;
    }
  });
}

module.exports = { register };


