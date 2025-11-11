const path = require("path");
const {
  SPECIAL_USER_ID,
  SPECIAL_USER_PHONE,
  SPECIAL_USER_MESSAGE,
} = require("../config/specialUser");
const { storage, normalizePhone } = require("../utils/storage");

const SPECIAL_USER_PHOTO_PATH = path.join(
  __dirname,
  "../images/roman.png"
);

async function isSpecialUser(entity, chatIdFromContext) {
  const userId = entity?.id ?? entity?.from?.id;
  if (SPECIAL_USER_ID && userId) {
    if (String(userId) === String(SPECIAL_USER_ID)) {
      return true;
    }
  }

  if (!SPECIAL_USER_PHONE) return false;

  const chatId =
    chatIdFromContext ??
    entity?.chat?.id ??
    entity?.message?.chat?.id ??
    entity?.chatId;

  if (!chatId) return false;

  const user = await storage.getUser(chatId);
  if (!user?.phone) return false;

  const normalizedPhone = normalizePhone(user.phone);
  if (!normalizedPhone) return false;

  return normalizedPhone === SPECIAL_USER_PHONE;
}

function register(bot) {
  if ((!SPECIAL_USER_ID && !SPECIAL_USER_PHONE) || !SPECIAL_USER_MESSAGE) {
    return;
  }

  bot.on("message", async (msg) => {
    if (!(await isSpecialUser(msg.from, msg.chat?.id))) return;

    await bot.sendPhoto(msg.chat.id, SPECIAL_USER_PHOTO_PATH, {
      caption: SPECIAL_USER_MESSAGE,
    });
  });

  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat?.id;
    if (!(await isSpecialUser(query.from, chatId))) return;

    if (!chatId) return;

    await bot.sendPhoto(chatId, SPECIAL_USER_PHOTO_PATH, {
      caption: SPECIAL_USER_MESSAGE,
    });
  });
}

module.exports = { register };
