const BACK_MENU = {
  reply_markup: {
    keyboard: [["⬅️ Назад"], ["Головне меню"]],
    resize_keyboard: true,
  },
};

function register(bot) {
  bot.on("message", (msg) => {
    if (!msg.text) return;
    if (msg.text === "⭐ Система лояльності") {
      bot.sendMessage(
        msg.chat.id,
        "Система лояльності ⭐\n— 5% кешбек бонусами\n— День народження: -10%\n— Спеціальні пропозиції для постійних гостей",
        BACK_MENU
      );
    }
  });
}

module.exports = { register };
