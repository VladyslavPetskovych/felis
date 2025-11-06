const BACK_MENU = {
  reply_markup: {
    keyboard: [["⬅️ Назад"], ["Головне меню"]],
    resize_keyboard: true,
  },
};

const OPTIONS = {
  reply_markup: BACK_MENU.reply_markup,
  parse_mode: "HTML",
  disable_web_page_preview: true,
};

function register(bot) {
  bot.on("message", (msg) => {
    if (!msg.text) return;
    if (msg.text === "📞 Контакти") {
      bot.sendMessage(
        msg.chat.id,
        "Контакти 📞\n" +
          "Телефон: +380634019122\n" +
          "Адреса: площа Старий Ринок, 9\n" +
          'Instagram: <b><a href="https://www.instagram.com/felis.restaurant">@felis</a></b>\n\n' +
          '<a href="https://t.me/felisrest">НАПИСАТИ НАМ</a>',
        OPTIONS
      );
    }
  });
}

module.exports = { register };
