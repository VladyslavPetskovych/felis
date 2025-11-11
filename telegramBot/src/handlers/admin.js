const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { storage } = require("../utils/storage");
const {
  translate,
  isButtonMatch,
  getAdminMenuKeyboard,
  getMainMenuKeyboard,
  DEFAULT_LANGUAGE,
} = require("../i18n");
const { isAdminPhone } = require("../config/admin");
const { buildPhoneExport } = require("../utils/phoneExport");

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
    await bot.sendChatAction(chatId, "upload_document").catch(() => {});
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

async function handleExportPhones(bot, chatId, language) {
  try {
    const users = await storage.getAllUsers();
    const {
      headers,
      rows,
      uniqueCount,
      totalCount,
      duplicateCount,
    } = buildPhoneExport(users);

    if (uniqueCount === 0) {
      await bot.sendMessage(
        chatId,
        translate(language, "admin.exportPhonesEmpty"),
        getAdminMenuKeyboard(language)
      );
      return true;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Phones");

    worksheet.addRow(headers);
    worksheet.getRow(1).font = { bold: true };
    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    for (let colIdx = 1; colIdx <= headers.length; colIdx += 1) {
      const column = worksheet.getColumn(colIdx);
      let maxLength = String(headers[colIdx - 1] || "").length;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const value =
          cell.value === null || cell.value === undefined
            ? ""
            : String(cell.value);
        maxLength = Math.max(maxLength, value.length);
      });
      column.width = Math.min(maxLength + 2, 40);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `phones-${timestamp}.xlsx`;
    const exportDir = path.join(process.cwd(), "exports");
    const filePath = path.join(exportDir, filename);

    fs.mkdirSync(exportDir, { recursive: true });
    await workbook.xlsx.writeFile(filePath);

    await bot.sendDocument(
      chatId,
      filePath,
      {
        caption: translate(language, "admin.exportPhonesSuccess", {
          total: totalCount,
          unique: uniqueCount,
          duplicates: duplicateCount,
        }),
        ...getAdminMenuKeyboard(language),
      }
    );
    return true;
  } catch (error) {
    await bot.sendMessage(
      chatId,
      translate(language, "admin.exportPhonesError"),
      getAdminMenuKeyboard(language)
    );
    return false;
  }
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

    if (isButtonMatch(text, "adminExportPhones")) {
      markHandled(msg);
      const handled = await handleExportPhones(bot, chatId, language);
      if (handled) return;
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

