const { storage } = require("../utils/storage");
const {
  translate,
  isButtonMatch,
  getAdminMenuKeyboard,
  getMainMenuKeyboard,
  DEFAULT_LANGUAGE,
} = require("../i18n");
const { isAdminPhone } = require("../config/admin");

const adminStates = new Map();

function getUserLanguageFallback(user) {
  return user?.language || DEFAULT_LANGUAGE;
}

function markHandled(msg) {
  if (msg && typeof msg === "object") {
    msg._handledByAdmin = true;
  }
}

async function ensureAdminUser(chatId) {
  const user = await storage.getUser(chatId);
  if (!user || !user.phone) return { isAdmin: false, user, language: DEFAULT_LANGUAGE };
  const isAdmin = isAdminPhone(user.phone);
  const language = getUserLanguageFallback(user);
  return { isAdmin, user, language };
}

function resetState(chatId) {
  adminStates.delete(chatId);
}

async function handleBroadcast(bot, msg, language) {
  const chatId = msg.chat.id;
  const state = adminStates.get(chatId);
  if (!state || state.mode !== "broadcast") return false;

  markHandled(msg);

  if (!msg.text) {
    await bot.sendMessage(chatId, translate(language, "admin.broadcastError"));
    resetState(chatId);
    return true;
  }

  try {
    const users = await storage.getAllUsers();
    let success = 0;
    let failed = 0;

    for (const user of users) {
      try {
        await bot.sendMessage(user.chatId, msg.text);
        success += 1;
      } catch (error) {
        failed += 1;
      }
    }

    await bot.sendMessage(
      chatId,
      translate(language, "admin.broadcastConfirm", { success, failed }),
      getAdminMenuKeyboard(language)
    );
  } catch (error) {
    await bot.sendMessage(
      chatId,
      translate(language, "admin.broadcastError"),
      getAdminMenuKeyboard(language)
    );
  } finally {
    resetState(chatId);
  }

  return true;
}

function register(bot) {
  bot.on("message", async (msg) => {
    const { chat } = msg;
    if (!chat || chat.type !== "private") return;

    const chatId = chat.id;
    const text = msg.text;
    const state = adminStates.get(chatId);

    if (!text && !state) return;

    const { isAdmin, language } = await ensureAdminUser(chatId);

    if (!isAdmin) {
      if (
        text &&
        (isButtonMatch(text, "adminPanel") ||
          isButtonMatch(text, "adminBroadcast") ||
          isButtonMatch(text, "adminCancel"))
      ) {
        const menu = getMainMenuKeyboard(language);
        await bot.sendMessage(
          chatId,
          translate(language, "start.backToMenu"),
          menu
        );
      }
      if (state) {
        resetState(chatId);
      }
      return;
    }

    if (state && state.mode === "broadcast") {
      const handled = await handleBroadcast(bot, msg, language);
      if (handled) return;
    }

    if (!text) return;

    if (isButtonMatch(text, "adminPanel")) {
      resetState(chatId);
      const keyboard = getAdminMenuKeyboard(language);
      markHandled(msg);
      await bot.sendMessage(chatId, translate(language, "admin.panelIntro"), {
        ...keyboard,
        parse_mode: "HTML",
      });
      return;
    }

    if (isButtonMatch(text, "adminBroadcast")) {
      adminStates.set(chatId, { mode: "broadcast" });
      const keyboard = getAdminMenuKeyboard(language);
      markHandled(msg);
      await bot.sendMessage(
        chatId,
        translate(language, "admin.broadcastPrompt"),
        keyboard
      );
      return;
    }

    if (isButtonMatch(text, "adminCancel")) {
      const wasInState = adminStates.has(chatId);
      resetState(chatId);
      if (wasInState) {
        const keyboard = getAdminMenuKeyboard(language);
        markHandled(msg);
        await bot.sendMessage(
          chatId,
          translate(language, "admin.broadcastCancelled"),
          keyboard
        );
      }
      return;
    }

    if (state && state.mode === "broadcast") {
      markHandled(msg);
      await handleBroadcast(bot, msg, language);
    }
  });
}

module.exports = { register };

