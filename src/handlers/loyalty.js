const { storage } = require("../utils/storage");
const { translate, getBackMenuKeyboard, isButtonMatch } = require("../i18n");

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (!isButtonMatch(msg.text, "loyalty")) return;

    const language = await storage.getUserLanguage(msg.chat.id);

    bot.sendMessage(
      msg.chat.id,
      translate(language, "loyalty.details"),
      getBackMenuKeyboard(language)
    );
  });
}

module.exports = { register };
