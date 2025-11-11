const { storage, normalizePhone } = require("../utils/storage");
const {
  translate,
  getMainMenuKeyboard,
  getButtonLabel,
  isButtonMatch,
  DEFAULT_LANGUAGE,
} = require("../i18n");
const { isAdminPhone } = require("../config/admin");

function requestContactKeyboard(language) {
  return {
    reply_markup: {
      keyboard: [
        [
          {
            text: getButtonLabel(language, "sharePhone"),
            request_contact: true,
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function buildSavedMessage(user, fallbackLanguage) {
  const language = user?.language || fallbackLanguage || DEFAULT_LANGUAGE;
  const who = user?.name || user?.username || user?.chatId;
  return translate(language, "phone.saved", { who, phone: user?.phone || "" });
}

function register(bot) {
  bot.on("message", async (msg) => {
    if (msg && msg._handledByAdmin) return;

    const text = msg.text || "";
    const existingUser = await storage.getUser(msg.chat.id);
    const language = existingUser?.language || DEFAULT_LANGUAGE;
    const existingIsAdmin = isAdminPhone(existingUser?.phone);

    if (text === "/phone" || isButtonMatch(text, "leavePhone")) {
      bot.sendMessage(
        msg.chat.id,
        translate(language, "phone.request"),
        requestContactKeyboard(language)
      );
      return;
    }

    if (msg.contact && msg.contact.user_id === msg.from.id) {
      const phone = msg.contact.phone_number;
      const normalized = normalizePhone(phone);
      if (!normalized) {
        bot.sendMessage(
          msg.chat.id,
          translate(language, "phone.invalid"),
          getMainMenuKeyboard(language, { isAdmin: existingIsAdmin })
        );
        return;
      }
      const user = await storage.saveUserPhone({
        chatId: msg.chat.id,
        phone: normalized,
        name: msg.from.first_name || "",
        username: msg.from.username || "",
      });
      const messageLanguage = user?.language || language;
      const isAdmin = isAdminPhone(user?.phone);
      const keyboard = getMainMenuKeyboard(messageLanguage, { isAdmin });
      bot.sendMessage(
        msg.chat.id,
        buildSavedMessage(user, messageLanguage),
        keyboard
      );
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
      const messageLanguage = user?.language || language;
      const isAdmin = isAdminPhone(user?.phone);
      const keyboard = getMainMenuKeyboard(messageLanguage, { isAdmin });
      bot.sendMessage(
        msg.chat.id,
        buildSavedMessage(user, messageLanguage),
        keyboard
      );
    }
  });
}

module.exports = { register, requestContactKeyboard };
