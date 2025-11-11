require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { storage } = require("../src/utils/storage");
const { buildPhoneExport } = require("../src/utils/phoneExport");

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
    const { headers, rows, records, uniqueCount } = buildPhoneExport(users);

    if (uniqueCount === 0) {
      console.log("⚠️  No phone numbers found in storage.");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const exportDir = path.join(process.cwd(), "exports");
    const csvPath = path.join(exportDir, `phones-${timestamp}.csv`);
    const jsonPath = path.join(exportDir, `phones-${timestamp}.json`);

    fs.mkdirSync(exportDir, { recursive: true });

    const csvData = [headers, ...rows]
      .map((row) => row.map(toCsvValue).join(";"))
      .join("\n");

    fs.writeFileSync(csvPath, csvData, "utf8");
    fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), "utf8");

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
