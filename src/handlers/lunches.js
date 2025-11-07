const { storage } = require("../utils/storage");
const { translate, isButtonMatch } = require("../i18n");

const LUNCH_ORDER_URL = "https://t.me/felisrest";
const LUNCH_CHANNEL_URL = "https://t.me/felis_food";

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (!isButtonMatch(msg.text, "lunches")) return;

    const language = await storage.getUserLanguage(msg.chat.id);
    bot.sendMessage(
      msg.chat.id,
      `${translate(language, "lunches.description")}\n\n${translate(
        language,
        "lunches.channelPrompt"
      )}`,
      {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: translate(language, "lunches.orderButton"),
                url: LUNCH_ORDER_URL,
              },
            ],
            [
              {
                text: translate(language, "lunches.channelButton"),
                url: LUNCH_CHANNEL_URL,
              },
            ],
          ],
        },
      }
    );
  });
}

module.exports = { register };
