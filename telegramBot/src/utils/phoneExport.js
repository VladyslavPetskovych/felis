function buildPhoneExport(users = []) {
  const byPhone = new Map();

  users.forEach((user) => {
    if (!user || !user.phone) return;

    const phone = String(user.phone);
    const entry = {
      phone,
      chatId: user.chatId || "",
      name: user.name || "",
      username: user.username || "",
      updatedAt: user.updatedAt || "",
      language: user.language || "",
    };

    if (!byPhone.has(phone)) {
      byPhone.set(phone, [entry]);
    } else {
      byPhone.get(phone).push(entry);
    }
  });

  const headers = [
    "№",
    "Phone",
    "Chat ID",
    "Name",
    "Username",
    "Updated At",
    "Language",
    "Duplicates",
  ];

  const rows = [];
  const records = [];
  let counter = 1;

  for (const [, entries] of byPhone.entries()) {
    entries.forEach((entry, idx) => {
      rows.push([
        idx === 0 ? counter : "",
        entry.phone,
        entry.chatId,
        entry.name,
        entry.username,
        entry.updatedAt,
        entry.language,
        idx === 0 ? entries.length - 1 : "",
      ]);

      records.push({
        phone: entry.phone,
        chatId: entry.chatId,
        name: entry.name,
        username: entry.username,
        updatedAt: entry.updatedAt,
        language: entry.language,
      });
    });
    counter += 1;
  }

  const uniqueCount = byPhone.size;
  const totalCount = records.length;
  const duplicateCount = Math.max(totalCount - uniqueCount, 0);

  return {
    headers,
    rows,
    records,
    uniqueCount,
    totalCount,
    duplicateCount,
  };
}

module.exports = { buildPhoneExport };

