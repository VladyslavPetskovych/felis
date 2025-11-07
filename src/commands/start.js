// src/commands/start.js
const { storage } = require("../utils/storage");
const {
  translate,
  getMainMenuKeyboard,
  isButtonMatch,
  DEFAULT_LANGUAGE,
} = require("../i18n");
const { requestContactKeyboard } = require("../handlers/phone");
const { isAdminPhone } = require("../config/admin");

function register(bot) {
  bot.onText(/\/start/, async (msg) => {
    const existingUser = await storage.getUser(msg.chat.id);
    const language = existingUser?.language || DEFAULT_LANGUAGE;
    const name = msg.from?.first_name || translate(language, "start.guestName");

    const isAdmin = existingUser?.phone
      ? isAdminPhone(existingUser.phone)
      : false;

    if (existingUser?.phone) {
      await bot.sendMessage(
        msg.chat.id,
        translate(language, "start.welcome", { name }),
        getMainMenuKeyboard(language, { isAdmin })
      );
      return;
    }

    await bot.sendMessage(
      msg.chat.id,
      translate(language, "start.requestPhone", { name }),
      requestContactKeyboard(language)
    );
  });

  // опціонально — показ меню якщо натиснули кнопку "Головне меню"
  bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (
      isButtonMatch(msg.text, "mainMenu") ||
      isButtonMatch(msg.text, "back")
    ) {
      const existingUser = await storage.getUser(msg.chat.id);
      const language = existingUser?.language || DEFAULT_LANGUAGE;
      const name =
        msg.from?.first_name || translate(language, "start.guestName");

      if (!existingUser || !existingUser.phone) {
        await bot.sendMessage(
          msg.chat.id,
          translate(language, "start.requestPhone", { name }),
          requestContactKeyboard(language)
        );
        return;
      }

      const isAdmin = isAdminPhone(existingUser.phone);

      bot.sendMessage(
        msg.chat.id,
        translate(language, "start.backToMenu"),
        getMainMenuKeyboard(language, { isAdmin })
      );
    }
  });
}

module.exports = { register };
