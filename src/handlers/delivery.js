const path = require("path");
const { storage } = require("../utils/storage");
const { translate, isButtonMatch } = require("../i18n");

const DELIVERY_LINK =
  "https://restoran126.choiceqr.com/delivery/section:snidanki/snidanki";
const GLOVO_LINK =
  "https://glovo.go.link/open?link_type=store&store_id=419724&adjust_t=j3diys8&adjust_campaign=Organic_Posts&adjust_adgroup=OrganicSocial_Acquisition_Facebook_All_Ukr_UA&adjust_deeplink=glovoapp%3A%2F%2Fopen%3Flink_type%3Dstore%26store_id%3D419724&adj_engagement_type=fallback_click&adjust_fallback=https%3A%2F%2Fglovoapp.com%2F%3Futm_source%3DSocial_media%26utm_medium%3DOrganic_Posts%26utm_campaign%3DOrganicSocial_Acquisition_Facebook_All_Ukr_UA&adj_redirect_macos=https%3A%2F%2Fglovoapp.com%2F%3Futm_source%3DSocial_media%26utm_medium%3DOrganic_Posts%26utm_campaign%3DOrganicSocial_Acquisition_Facebook_All_Ukr_UA";
const BOLT_LINK =
  "https://food.bolt.eu/uk-UA/496/p/102951-felis?utm_source=share_provider&utm_medium=product&utm_content=menu_header";
const DELIVERY_PHOTO_PATH = path.join(__dirname, "../images/delivery.jpg");

function register(bot) {
  bot.on("message", async (msg) => {
    if (!msg.text) return;
    if (!isButtonMatch(msg.text, "delivery")) return;

    const language = await storage.getUserLanguage(msg.chat.id);

    await bot.sendPhoto(msg.chat.id, DELIVERY_PHOTO_PATH, {
      caption: translate(language, "delivery.details"),
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: translate(language, "delivery.orderButton"),
              url: DELIVERY_LINK,
            },
          ],
          [
            {
              text: translate(language, "delivery.glovoButton"),
              url: GLOVO_LINK,
            },
            {
              text: translate(language, "delivery.boltButton"),
              url: BOLT_LINK,
            },
          ],
        ],
      },
    });
  });
}

module.exports = { register };
