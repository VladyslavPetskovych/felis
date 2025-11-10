const { storage } = require("../utils/storage");
const {
  translate,
  getLanguageMenuKeyboard,
  getMainMenuKeyboard,
  isButtonMatch,
  normalizeLanguageSelection,
  DEFAULT_LANGUAGE,
} = require("../i18n");
const { isAdminPhone } = require("../config/admin");

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;

    const selectedLanguage = normalizeLanguageSelection(msg.text);
    if (selectedLanguage) {
      const updatedUser = await storage.setUserLanguage(
        msg.chat.id,
        selectedLanguage
      );
      const isAdmin = isAdminPhone(updatedUser?.phone);
      bot.sendMessage(
        msg.chat.id,
        translate(selectedLanguage, "language.confirm"),
        getMainMenuKeyboard(selectedLanguage, { isAdmin })
      );
      return;
    }

    if (isButtonMatch(msg.text, "changeLanguage")) {
      const user = await storage.getUser(msg.chat.id);
      const language = user?.language || DEFAULT_LANGUAGE;
      bot.sendMessage(
        msg.chat.id,
        translate(language, "language.prompt"),
        getLanguageMenuKeyboard(language)
      );
    }
  });
}

module.exports = { register };
