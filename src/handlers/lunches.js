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

const INLINE_CHANNEL = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Перейти до каналу Felis Food",
          url: "https://t.me/felis_food",
        },
      ],
    ],
  },
  parse_mode: "HTML",
  disable_web_page_preview: true,
};

function register(bot) {
  bot.on("message", (msg) => {
    if (!msg.text) return;
    if (msg.text === "🥗 Ланчі") {
      const text =
        "🥗 <b>Felis — твій смачний обід!</b>\n\n" +
        "Українська та європейська кухня — смачно, ситно, зручно❤️\n\n" +
        "🍛 Бізнес-ланч лише 200 грн\n\n" +
        "📋 Щодня публікуємо меню комплексних обідів.\n\n" +
        "📦 При замовленні 10 ланчів — доставка безкоштовна\n\n" +
        "🕚 Замовлення приймаємо до 11:00\n\n" +
        "🚗 Доставка з 12:00 до 14:00\n\n" +
        "Felis — смачно як у мами🫰🏽\n\n" +
        '<a href="https://t.me/felisrest">ЗАМОВИТИ</a>';

      bot.sendMessage(msg.chat.id, text, OPTIONS);

      bot.sendMessage(
        msg.chat.id,
        "Канал із щоденними ланч-оновленнями:",
        INLINE_CHANNEL
      );
    }
  });
}

module.exports = { register };
