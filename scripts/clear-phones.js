require("dotenv").config();
const { storage } = require("../src/utils/storage");

async function clearAllPhones() {
  try {
    console.log("🗑️  Clearing all phone numbers from Redis...");
    const deletedCount = await storage.clearAllPhones();
    if (deletedCount > 0) {
      console.log(`✅ Successfully deleted ${deletedCount} items from Redis`);
    }
    console.log("✅ JSON file cleared (if it existed)");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

clearAllPhones().then(() => process.exit(0));
