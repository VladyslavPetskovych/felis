const { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } = require("../config/language");

const translations = {
  uk: {
    buttons: {
      menu: "🍽 Меню",
      promotions: "🎁 Акції",
      delivery: "🚚 Доставка",
      changeLanguage: "🌐 Змінити мову",
      feedback: "💬 Залишити відгук",
      contacts: "📞 Контакти",
      lunches: "🥗 Ланчі",
      loyalty: "⭐ Система лояльності",
      adminPanel: "🛠 Адмін панель",
      adminBroadcast: "📢 Створити оголошення",
      adminExportPhones: "📞 Експорт номерів",
      adminCancel: "❌ Скасувати",
      back: "⬅️ Назад",
      mainMenu: "Головне меню",
      sharePhone: "📱 Поділитись номером",
      leavePhone: "📱 Залишити номер",
      languageUk: "Українська",
      languageEn: "English",
    },
    messages: {
      start: {
        welcome: "Вітаємо, {{name}}! 👋\nОберіть розділ:",
        requestPhone:
          "Вітаємо, {{name}}! 👋\nЩоб продовжити, поділіться, будь ласка, номером телефону.",
        backToMenu: "Повертаємось у меню:",
        guestName: "Гість",
      },
      language: {
        prompt: "Оберіть мову інтерфейсу:",
        confirm: "Мова встановлена: Українська 🇺🇦",
      },
      menu: {
        caption:
          "🍽 <b>Меню Felis</b>\n\nНатисніть кнопку нижче, щоб переглянути повне меню.",
        viewButton: "Переглянути меню",
      },
      promotions: {
        list: 'Поточні акції 🎁\n\n1. Глінтвейн за відмітку в сторіз 🍹\nВідпочивай у нас, відмічай це в сторіз у інстаграмі та показуй відмітку офіціанту — отримуй глінтвейн безкоштовно.\n\n2. Десерт в честь дня народження ❤️\nДеталі:\nПриходь у Felis 👉🏻 показуй свої документи 👉🏻 святкуй 🌿\n\n3. ФІРМОВА ПАЛЯНИЧКА ЗА ВІДГУК 🥗\nПиши у пошуку "Google" Ресторан Felis та залишай свій відгук на нашій сторінці <b><a href="https://www.google.com/maps/place/Феліс/@49.8459642,24.0304369,21z/data=!4m8!3m7!1s0x473addd6402680cd:0x1a070492fe838bf5!8m2!3d49.8459503!4d24.0304678!9m1!1b1!16s%2Fg%2F11y4nc8lhl?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D">(ЗАЛИШИТИ ВІДГУК)</a></b>, а потім приходь за своєю безкоштовною паляничкою.',
      },
      delivery: {
        details:
          "Умови доставки 🚚\n— Час: 09:00–21:30\n— Вартість: від 60 грн (залежно від району)\n— Самовивіз: безкоштовно",
        orderButton: "Зробити замовлення",
        glovoButton: "Glovo",
        boltButton: "Bolt Food",
      },
      feedback: {
        prompt:
          "Будемо раді вашому відгуку 💬\nВідпишіть, будь ласка, повідомленням ваші враження або пропозиції.",
        googleButton: "Відгук у Google",
      },
      contacts: {
        details:
          'Контакти 📞\nТелефон: +380634019122\nАдреса: площа Старий Ринок, 9\nInstagram: <b><a href="https://www.instagram.com/felis.restaurant">@felis</a></b>\n\n<a href="https://t.me/felisrest">НАПИСАТИ НАМ</a>',
      },
      lunches: {
        description:
          "🥗 <b>Felis — твій смачний обід!</b>\n\nУкраїнська та європейська кухня — смачно, ситно, зручно❤️\n\n🍛 Бізнес-ланч лише 200 грн\n\n📋 Щодня публікуємо меню комплексних обідів.\n\n📦 При замовленні 10 ланчів — доставка безкоштовна\n\n🕚 Замовлення приймаємо до 11:00\n\n🚗 Доставка з 12:00 до 14:00\n\nFelis — смачно як у мами🫰🏽\n\nНатисніть кнопку нижче, щоб оформити замовлення.",
        channelPrompt: "Канал із щоденними ланч-оновленнями:",
        orderButton: "Замовити ланч",
        channelButton: "Перейти до каналу Felis Food",
      },
      loyalty: {
        details:
          "Система лояльності ⭐\n— 5% кешбек бонусами\n— День народження: -10%\n— Спеціальні пропозиції для постійних гостей",
      },
      phone: {
        request: "Надішліть номер телефону, або натисніть кнопку нижче:",
        invalid:
          "Не вдалося розпізнати номер. Введіть, будь ласка, у форматі +380XXXXXXXXX.",
        saved: "Дякуємо, {{who}}! ✅\nЗберегли ваш номер: {{phone}}",
      },
      admin: {
        panelIntro:
          "🛠 <b>Адмін панель</b>\nОберіть дію нижче, щоб керувати повідомленнями.",
        broadcastPrompt:
          "📢 Надішліть текст оголошення одним повідомленням. Воно буде розіслане всім користувачам.",
        broadcastConfirm:
          "✅ Оголошення відправлено: успішно — {{success}}, з помилкою — {{failed}}.",
        broadcastError:
          "⚠️ Не вдалося розіслати оголошення. Спробуйте пізніше.",
        broadcastCancelled: "ℹ️ Розсилку скасовано.",
        exportPhonesEmpty:
          "⚠️ Немає збережених номерів телефону для експорту.",
        exportPhonesSuccess:
          "✅ Номери експортовано. Всього записів: {{total}}, унікальних номерів: {{unique}}, дублікатів: {{duplicates}}.",
        exportPhonesError:
          "⚠️ Не вдалося створити файл з номерами. Спробуйте пізніше.",
      },
      languageNames: {
        uk: "Українська",
        en: "English",
      },
    },
  },
  en: {
    buttons: {
      menu: "🍽 Menu",
      promotions: "🎁 Promotions",
      delivery: "🚚 Delivery",
      changeLanguage: "🌐 Change language",
      feedback: "💬 Leave feedback",
      contacts: "📞 Contacts",
      lunches: "🥗 Lunches",
      loyalty: "⭐ Loyalty program",
      adminPanel: "🛠 Admin panel",
      adminBroadcast: "📢 Create announcement",
      adminExportPhones: "📞 Export phones",
      adminCancel: "❌ Cancel",
      back: "⬅️ Back",
      mainMenu: "Main menu",
      sharePhone: "📱 Share phone number",
      leavePhone: "📱 Leave phone number",
      languageUk: "Ukrainian",
      languageEn: "English",
    },
    messages: {
      start: {
        welcome: "Welcome, {{name}}! 👋\nChoose a section:",
        requestPhone:
          "Welcome, {{name}}! 👋\nTo continue, please share your phone number.",
        backToMenu: "Back to the main menu:",
        guestName: "Guest",
      },
      language: {
        prompt: "Choose the interface language:",
        confirm: "Language set: English 🇬🇧",
      },
      menu: {
        caption:
          "🍽 <b>Felis Menu</b>\n\nTap the button below to view the full menu.",
        viewButton: "View menu",
      },
      promotions: {
        list: 'Current promotions 🎁\n\n1. Mulled wine for an Instagram story mention 🍹\nVisit us, mention Felis in your story, show it to the waiter — and enjoy a free mulled wine.\n\n2. Complimentary birthday dessert ❤️\nDetails:\nCome to Felis 👉🏻 show your ID 👉🏻 celebrate 🌿\n\n3. SIGNATURE FLATBREAD FOR A REVIEW 🥗\nSearch for "Felis Restaurant" on Google, leave a review on our page <b><a href="https://www.google.com/maps/place/Феліс/@49.8459642,24.0304369,21z/data=!4m8!3m7!1s0x473addd6402680cd:0x1a070492fe838bf5!8m2!3d49.8459503!4d24.0304678!9m1!1b1!16s%2Fg%2F11y4nc8lhl?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D">(LEAVE A REVIEW)</a></b>, and then stop by for your free flatbread.',
      },
      delivery: {
        details:
          "Delivery terms 🚚\n— Time: 09:00–21:30\n— Cost: from 60 UAH (depends on district)\n— Pickup: free",
        orderButton: "Order delivery",
        glovoButton: "Glovo",
        boltButton: "Bolt Food",
      },
      feedback: {
        prompt:
          "We would love to hear from you 💬\nSend us a message with your impressions or suggestions.",
        googleButton: "Review on Google",
      },
      contacts: {
        details:
          'Contacts 📞\nPhone: +380634019122\nAddress: Staryi Rynok Square, 9\nInstagram: <b><a href="https://www.instagram.com/felis.restaurant">@felis</a></b>\n\n<a href="https://t.me/felisrest">CONTACT US</a>',
      },
      lunches: {
        description:
          "🥗 <b>Felis — your tasty lunch!</b>\n\nUkrainian and European cuisine — delicious, hearty, convenient ❤️\n\n🍛 Business lunch only 200 UAH\n\n📋 We publish set lunch menus every day.\n\n📦 Order 10 lunches — delivery is free\n\n🕚 Orders accepted until 11:00\n\n🚗 Delivery from 12:00 to 14:00\n\nFelis — tastes like home 🫰🏽\n\nTap the button below to place an order.",
        channelPrompt: "Channel with daily lunch updates:",
        orderButton: "Order lunch",
        channelButton: "Go to Felis Food channel",
      },
      loyalty: {
        details:
          "Loyalty program ⭐\n— 5% cashback in bonuses\n— Birthday: -10%\n— Special offers for regular guests",
      },
      phone: {
        request: "Send your phone number or tap the button below:",
        invalid:
          "We couldn’t recognise the number. Please use the format +380XXXXXXXXX.",
        saved: "Thank you, {{who}}! ✅\nWe saved your number: {{phone}}",
      },
      admin: {
        panelIntro:
          "🛠 <b>Admin panel</b>\nChoose an action below to manage announcements.",
        broadcastPrompt:
          "📢 Send the announcement text in a single message. It will be delivered to all users.",
        broadcastConfirm:
          "✅ Announcement sent: success — {{success}}, failed — {{failed}}.",
        broadcastError:
          "⚠️ Failed to send the announcement. Please try again later.",
        broadcastCancelled: "ℹ️ Broadcast cancelled.",
        exportPhonesEmpty:
          "⚠️ There are no saved phone numbers to export.",
        exportPhonesSuccess:
          "✅ Phone numbers exported. Total rows: {{total}}, unique numbers: {{unique}}, duplicates: {{duplicates}}.",
        exportPhonesError:
          "⚠️ Could not generate the file with phone numbers. Please try again later.",
      },
      languageNames: {
        uk: "Ukrainian",
        en: "English",
      },
    },
  },
};

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
      return acc[part];
    }
    return undefined;
  }, obj);
}

function formatTemplate(template, params) {
  if (!params || typeof template !== "string") return template;
  return template.replace(/{{(\w+)}}/g, (_, key) => {
    if (params[key] === undefined || params[key] === null) return "";
    return String(params[key]);
  });
}

function translate(lang, key, params = {}) {
  const normalized = SUPPORTED_LANGUAGES.includes(lang)
    ? lang
    : DEFAULT_LANGUAGE;
  const value = getNestedValue(translations[normalized].messages, key);
  if (value !== undefined) {
    return formatTemplate(value, params);
  }
  const fallback = getNestedValue(translations[DEFAULT_LANGUAGE].messages, key);
  return formatTemplate(fallback !== undefined ? fallback : key, params);
}

function getButtonLabel(lang, key) {
  const normalized = SUPPORTED_LANGUAGES.includes(lang)
    ? lang
    : DEFAULT_LANGUAGE;
  const value = translations[normalized].buttons[key];
  if (value) return value;
  return translations[DEFAULT_LANGUAGE].buttons[key] || key;
}

function buildKeyboardFromKeys(lang, layout) {
  return layout.map((row) => row.map((key) => getButtonLabel(lang, key)));
}

function getMainMenuKeyboard(lang, options = {}) {
  const layout = [
    ["menu", "promotions"],
    ["delivery", "changeLanguage"],
    ["feedback", "contacts"],
    ["lunches"],
  ];

  if (options.isAdmin) {
    layout.push(["adminPanel"]);
  }

  return {
    reply_markup: {
      keyboard: buildKeyboardFromKeys(lang, layout),
      resize_keyboard: true,
    },
  };
}

function getLanguageMenuKeyboard(lang) {
  return {
    reply_markup: {
      keyboard: buildKeyboardFromKeys(lang, [
        ["languageUk", "languageEn"],
        ["back"],
        ["mainMenu"],
      ]),
      resize_keyboard: true,
    },
  };
}

function getAdminMenuKeyboard(lang) {
  return {
    reply_markup: {
      keyboard: buildKeyboardFromKeys(lang, [
        ["adminBroadcast"],
        ["adminExportPhones"],
        ["adminCancel"],
        ["mainMenu"],
      ]),
      resize_keyboard: true,
    },
  };
}

function getLanguageName(lang, target) {
  const normalized = SUPPORTED_LANGUAGES.includes(lang)
    ? lang
    : DEFAULT_LANGUAGE;
  const names = translations[normalized].messages.languageNames;
  if (names && names[target]) return names[target];
  return (
    translations[DEFAULT_LANGUAGE].messages.languageNames[target] || target
  );
}

function isButtonMatch(text, key) {
  if (!text) return false;
  return SUPPORTED_LANGUAGES.some(
    (lang) =>
      translations[lang].buttons[key] &&
      translations[lang].buttons[key] === text
  );
}

function normalizeLanguageSelection(text) {
  if (isButtonMatch(text, "languageUk")) return "uk";
  if (isButtonMatch(text, "languageEn")) return "en";
  return null;
}

module.exports = {
  translate,
  getButtonLabel,
  getMainMenuKeyboard,
  getLanguageMenuKeyboard,
  getAdminMenuKeyboard,
  getLanguageName,
  isButtonMatch,
  normalizeLanguageSelection,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
};
