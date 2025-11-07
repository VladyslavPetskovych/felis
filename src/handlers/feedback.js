const { storage } = require("../utils/storage");
const { translate, isButtonMatch } = require("../i18n");

const REVIEW_LINK =
  "https://www.google.com/maps/place/%D0%A4%D0%B5%D0%BB%D1%96%D1%81/@49.845903,24.0305302,20.5z/data=!4m6!3m5!1s0x473addd6402680cd:0x1a070492fe838bf5!8m2!3d49.8459503!4d24.0304678!16s%2Fg%2F11y4nc8lhl?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D";

function buildInlineMenu(language) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: translate(language, "feedback.googleButton"),
            url: REVIEW_LINK,
          },
        ],
      ],
    },
  };
}

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (!isButtonMatch(msg.text, "feedback")) return;

    const language = await storage.getUserLanguage(msg.chat.id);

    bot.sendMessage(
      msg.chat.id,
      translate(language, "feedback.prompt"),
      buildInlineMenu(language)
    );
  });
}

module.exports = { register };
