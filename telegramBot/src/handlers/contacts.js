const path = require("path");
const { storage } = require("../utils/storage");
const {
  translate,
  getMainMenuKeyboard,
  isButtonMatch,
  DEFAULT_LANGUAGE,
} = require("../i18n");
const { isAdminPhone } = require("../config/admin");

const CONTACT_VIDEO_PATH = path.join(__dirname, "../images/Felis Contact.mp4");

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
      caption: translate(language, "contacts.details"),
    };

    bot.sendVideo(msg.chat.id, CONTACT_VIDEO_PATH, options);
  });
}

module.exports = { register };
