require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { storage } = require("../src/utils/storage");

function toCsvValue(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  if (/[,\n;]/.test(str)) {
    return `"${str}"`;
  }
  return str;
}

async function exportPhones() {
  try {
    const users = await storage.getAllUsers();
    const byPhone = new Map();

    users.forEach((user) => {
      const phone = user.phone || "";
      if (!phone) return;

      const existing = byPhone.get(phone);
      const payload = {
        phone,
        chatId: user.chatId || "",
        name: user.name || "",
        username: user.username || "",
        updatedAt: user.updatedAt || "",
        language: user.language || "",
      };

      if (!existing) {
        byPhone.set(phone, [payload]);
      } else {
        existing.push(payload);
      }
    });

    if (byPhone.size === 0) {
      console.log("⚠️  No phone numbers found in storage.");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const exportDir = path.join(process.cwd(), "exports");
    const csvPath = path.join(exportDir, `phones-${timestamp}.csv`);
    const jsonPath = path.join(exportDir, `phones-${timestamp}.json`);

    fs.mkdirSync(exportDir, { recursive: true });

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
    let counter = 1;

    for (const [phone, entries] of byPhone.entries()) {
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
      });
      counter += 1;
    }

    const csvData = [headers, ...rows]
      .map((row) => row.map(toCsvValue).join(";"))
      .join("\n");

    fs.writeFileSync(csvPath, csvData, "utf8");
    fs.writeFileSync(
      jsonPath,
      JSON.stringify(
        rows.map(([, phone, chatId, name, username, updatedAt, language]) => ({
          phone,
          chatId,
          name,
          username,
          updatedAt,
          language,
        })),
        null,
        2
      ),
      "utf8"
    );

    console.log("✅ Export completed successfully.");
    console.log(`📄 CSV: ${csvPath}`);
    console.log(`📄 JSON: ${jsonPath}`);
    console.log(
      "💡 Tip: Open the CSV file in Excel (use ';' as delimiter if asked)."
    );
  } catch (error) {
    console.error("❌ Failed to export phone numbers:", error.message);
    process.exit(1);
  }
}

exportPhones().then(() => process.exit(0));
