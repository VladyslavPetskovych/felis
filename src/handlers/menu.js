const path = require("path");
const { storage } = require("../utils/storage");
const { translate, isButtonMatch } = require("../i18n");

const MENU_LINK =
  "https://restoran126.choiceqr.com/section:snidanki/snidanki";
const MENU_PHOTO_PATH = path.join(__dirname, "../images/food1.jpg");

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (!isButtonMatch(msg.text, "menu")) return;

    const language = await storage.getUserLanguage(msg.chat.id);

    bot.sendPhoto(msg.chat.id, MENU_PHOTO_PATH, {
      caption: translate(language, "menu.caption"),
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: translate(language, "menu.viewButton"),
              url: MENU_LINK,
            },
          ],
        ],
      },
    });
  });
}

module.exports = { register };
