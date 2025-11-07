const fs = require("fs");
const path = require("path");
const { DEFAULT_LANGUAGE } = require("../config/language");
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

    const id = String(chatId);
    const updates = {
      chatId: id,
      phone: normalized,
      name,
      username,
      updatedAt: new Date().toISOString(),
    };

    if (await this.ready()) {
      const kUser = `user:${id}`;
      const kPhone = `phone:${normalized}`;
      await this.redis.hset(kUser, updates);
      await this.redis.hset(kPhone, { number: normalized, name, username });
      await this.redis.sadd("phones", normalized);
      return this.getUser(id);
    }

    const db = readJsonSafe(USERS_JSON);
    const existing = db[id] || {};
    db[id] = { ...existing, ...updates };
    writeJsonSafe(USERS_JSON, db);
    return this.getUser(id);
  }

  async getUser(chatId) {
    const key = chatId ? String(chatId) : null;
    if (!key) return null;

    if (await this.ready()) {
      const data = await this.redis.hgetall(`user:${key}`);
      if (!data || Object.keys(data).length === 0) return null;
      return {
        chatId: data.chatId || key,
        phone: data.phone || null,
        name: data.name || "",
        username: data.username || "",
        updatedAt: data.updatedAt || null,
        language: data.language || DEFAULT_LANGUAGE,
      };
    }

    const db = readJsonSafe(USERS_JSON);
    const record = db[key] || null;
    if (!record) return null;
    return {
      chatId: record.chatId || key,
      phone: record.phone || null,
      name: record.name || "",
      username: record.username || "",
      updatedAt: record.updatedAt || null,
      language: record.language || DEFAULT_LANGUAGE,
    };
  }

  async setUserLanguage(chatId, language) {
    if (!chatId) throw new Error("Invalid chatId");
    const id = String(chatId);
    const updates = {
      chatId: id,
      language,
      updatedAt: new Date().toISOString(),
    };

    if (await this.ready()) {
      await this.redis.hset(`user:${id}`, updates);
      return this.getUser(id);
    }

    const db = readJsonSafe(USERS_JSON);
    const existing = db[id] || { chatId: id };
    db[id] = { ...existing, ...updates };
    writeJsonSafe(USERS_JSON, db);
    return this.getUser(id);
  }

  async getUserLanguage(chatId) {
    const user = await this.getUser(chatId);
    return user?.language || DEFAULT_LANGUAGE;
  }

  async getAllUsers() {
    if (await this.ready()) {
      const users = [];
      const stream = this.redis.scanStream({ match: "user:*", count: 100 });

      for await (const keysChunk of stream) {
        const keysArray = Array.isArray(keysChunk) ? keysChunk : [keysChunk];
        if (!keysArray.length) continue;

        const pipeline = this.redis.pipeline();
        keysArray.forEach((key) => pipeline.hgetall(key));
        const results = await pipeline.exec();

        results.forEach(([err, data], idx) => {
          if (err || !data || Object.keys(data).length === 0) return;
          const chatId = data.chatId || keysArray[idx].replace(/^user:/, "");
          users.push({
            chatId,
            phone: data.phone || null,
            name: data.name || "",
            username: data.username || "",
            updatedAt: data.updatedAt || null,
            language: data.language || DEFAULT_LANGUAGE,
          });
        });
      }

      return users;
    }

    const db = readJsonSafe(USERS_JSON);
    return Object.entries(db).map(([key, record]) => ({
      chatId: String(record.chatId || key),
      phone: record.phone || null,
      name: record.name || "",
      username: record.username || "",
      updatedAt: record.updatedAt || null,
      language: record.language || DEFAULT_LANGUAGE,
    }));
  }

  async clearAllPhones() {
    let deletedCount = 0;
    const redisAvailable = await this.ready();

    if (!redisAvailable) {
      console.log("⚠️  Redis is not available, clearing JSON file only");
    } else {
      // Delete all user:* keys in batches
      const userKeys = [];
      for await (const key of this.redis.scanStream({
        match: "user:*",
        count: 100,
      })) {
        userKeys.push(key);
      }
      // Delete in batches of 100 to avoid command size limits
      for (let i = 0; i < userKeys.length; i += 100) {
        const batch = userKeys.slice(i, i + 100);
        if (batch.length > 0) {
          await this.redis.del(...batch);
          deletedCount += batch.length;
        }
      }

      // Delete all phone:* keys in batches
      const phoneKeys = [];
      for await (const key of this.redis.scanStream({
        match: "phone:*",
        count: 100,
      })) {
        phoneKeys.push(key);
      }
      for (let i = 0; i < phoneKeys.length; i += 100) {
        const batch = phoneKeys.slice(i, i + 100);
        if (batch.length > 0) {
          await this.redis.del(...batch);
          deletedCount += batch.length;
        }
      }

      // Delete the phones set
      const phonesSetSize = await this.redis.scard("phones");
      if (phonesSetSize > 0) {
        await this.redis.del("phones");
        deletedCount += 1;
      }
    }

    // Also clear JSON file if it exists
    if (fs.existsSync(USERS_JSON)) {
      writeJsonSafe(USERS_JSON, {});
    }

    return deletedCount;
  }
}

const storage = new Storage();

module.exports = { storage, normalizePhone };
