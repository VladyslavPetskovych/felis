const { storage } = require("../utils/storage");
const { translate, getBackMenuKeyboard, isButtonMatch } = require("../i18n");

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (!isButtonMatch(msg.text, "promotions")) return;

    const language = await storage.getUserLanguage(msg.chat.id);

    bot.sendMessage(
      msg.chat.id,
      translate(language, "promotions.list"),
      getBackMenuKeyboard(language)
    );
  });
}

module.exports = { register };
