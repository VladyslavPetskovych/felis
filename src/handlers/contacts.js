const { storage } = require("../utils/storage");
const { translate, getBackMenuKeyboard, isButtonMatch } = require("../i18n");

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (!isButtonMatch(msg.text, "contacts")) return;

    const language = await storage.getUserLanguage(msg.chat.id);
    const options = {
      ...getBackMenuKeyboard(language),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };

    bot.sendMessage(
      msg.chat.id,
      translate(language, "contacts.details"),
      options
    );
  });
}

module.exports = { register };
