const BACK_MENU = {
  reply_markup: {
    keyboard: [["⬅️ Назад"], ["Головне меню"]],
    resize_keyboard: true,
  },
};

function register(bot) {
  bot.on("message", (msg) => {
    if (!msg.text) return;
    if (msg.text === "💬 Залишити відгук") {
      bot.sendMessage(
        msg.chat.id,
        "Будемо раді вашому відгуку 💬\nВідпишіть, будь ласка, повідомленням ваші враження або пропозиції.",
        BACK_MENU
      );
    }
  });
}

module.exports = { register };
