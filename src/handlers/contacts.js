const { storage } = require("../utils/storage");
const {
  translate,
  getMainMenuKeyboard,
  isButtonMatch,
  DEFAULT_LANGUAGE,
} = require("../i18n");
const { isAdminPhone } = require("../config/admin");

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (!isButtonMatch(msg.text, "contacts")) return;

    const user = await storage.getUser(msg.chat.id);
    const language = user?.language || DEFAULT_LANGUAGE;
    const isAdmin = isAdminPhone(user?.phone);
    const options = {
      ...getMainMenuKeyboard(language, { isAdmin }),
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
