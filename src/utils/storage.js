const fs = require("fs");
const path = require("path");
let Redis;
try {
  Redis = require("ioredis");
} catch (_) {}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_JSON = path.join(DATA_DIR, "users.json");

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return {};
    const raw = fs.readFileSync(filePath, "utf8");
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function writeJsonSafe(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function normalizePhone(input) {
  if (!input) return null;
  let p = String(input).trim();
  // Keep leading +, digits otherwise
  p = p.replace(/[^+\d]/g, "");
  if (p.startsWith("00")) p = "+" + p.slice(2);
  if (/^\d{10}$/.test(p)) p = "+38" + p; // naive UA fallback for 10 digits
  if (!/^\+?\d{9,15}$/.test(p)) return null;
  if (!p.startsWith("+")) p = "+" + p;
  return p;
}

class Storage {
  constructor() {
    this.redisUrl = process.env.REDIS_URL || null;
    this.redis = null;
    if (this.redisUrl && Redis) {
      try {
        this.redis = new Redis(this.redisUrl);
      } catch (_) {
        this.redis = null;
      }
    }
  }

  async ready() {
    if (!this.redis) return false;
    try {
      await this.redis.ping();
      return true;
    } catch (_) {
      return false;
    }
  }

  async saveUserPhone(payload) {
    const { chatId, phone, name = "", username = "" } = payload;
    const normalized = normalizePhone(phone);
    if (!chatId || !normalized) {
      throw new Error("Invalid chatId or phone");
    }

    const user = {
      chatId: String(chatId),
      phone: normalized,
      name,
      username,
      updatedAt: new Date().toISOString(),
    };

    if (await this.ready()) {
      const kUser = `user:${chatId}`;
      const kPhone = `phone:${normalized}`;
      await this.redis.hset(kUser, user);
      await this.redis.hset(kPhone, { number: normalized, name, username });
      await this.redis.sadd("phones", normalized);
      return user;
    }

    const db = readJsonSafe(USERS_JSON);
    db[chatId] = user;
    writeJsonSafe(USERS_JSON, db);
    return user;
  }
}

const storage = new Storage();

module.exports = { storage, normalizePhone };


