const { storage } = require("../utils/storage");
const {
  translate,
  getLanguageMenuKeyboard,
  getBackMenuKeyboard,
  isButtonMatch,
  normalizeLanguageSelection,
} = require("../i18n");

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;

    const selectedLanguage = normalizeLanguageSelection(msg.text);
    if (selectedLanguage) {
      await storage.setUserLanguage(msg.chat.id, selectedLanguage);
      bot.sendMessage(
        msg.chat.id,
        translate(selectedLanguage, "language.confirm"),
        getBackMenuKeyboard(selectedLanguage)
      );
      return;
    }

    if (isButtonMatch(msg.text, "changeLanguage")) {
      const language = await storage.getUserLanguage(msg.chat.id);
      bot.sendMessage(
        msg.chat.id,
        translate(language, "language.prompt"),
        getLanguageMenuKeyboard(language)
      );
    }
  });
}

module.exports = { register };
