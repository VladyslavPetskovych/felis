// src/db.js
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

const kUser = (id) => `user:${id}`;
const kPhone = (num) => `phone:${num}`;
const idxPhones = "idx:phones";

async function ensureIndexes() {
  try {
    await redis.call("FT.INFO", idxPhones);
    return;
  } catch (_) {}
  await redis.call(
    "FT.CREATE",
    idxPhones,
    "ON",
    "HASH",
    "PREFIX",
    "1",
    "phone:",
    "SCHEMA",
    "number",
    "TAG",
    "AS",
    "number",
    "name",
    "TEXT",
    "meta",
    "TEXT"
  );
}

async function initRedis(options = {}) {
  const { timeoutMs = 15000, pingIntervalMs = 500 } = options;
  const startTs = Date.now();
  // Wait until Redis is ready (ioredis auto-retries connecting under the hood)
  // We explicitly ping to block startup until ready or timeout.
  // Avoid unbounded wait in case of misconfiguration.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await redis.ping();
      break;
    } catch (err) {
      if (Date.now() - startTs > timeoutMs) {
        throw new Error(
          `Redis is not ready within ${timeoutMs}ms: ${err.message}`
        );
      }
      await new Promise((r) => setTimeout(r, pingIntervalMs));
    }
  }

  // Ensure RediSearch indexes exist once connection is ready
  try {
    await ensureIndexes();
  } catch (err) {
    // If RediSearch module is not available or FT.CREATE fails, surface the error early
    throw new Error(`Failed to ensure Redis indexes: ${err.message}`);
  }
}

module.exports = {
  ensureIndexes,
  initRedis,
  async saveUser(id, data) {
    await redis.set(kUser(id), JSON.stringify(data));
  },
  async getUser(id) {
    const v = await redis.get(kUser(id));
    return v ? JSON.parse(v) : null;
  },
  async addPhone(number, payload) {
    await redis.hset(kPhone(number), { number, ...payload });
  },
  async getPhone(number) {
    const v = await redis.hgetall(kPhone(number));
    return Object.keys(v).length ? v : null;
  },
  async searchPhones(q) {
    const query =
      q.startsWith("+") || /\d/.test(q)
        ? `@number:{${q.replaceAll("*", "\\*")}*}`
        : `@name:(${q})`;
    const res = await redis.call(
      "FT.SEARCH",
      idxPhones,
      query,
      "LIMIT",
      "0",
      "10"
    );
    // res формат: [total, key, [field, value, ...], ...]
    const out = [];
    for (let i = 2; i < res.length; i += 2) {
      const arr = res[i + 1];
      const obj = {};
      for (let j = 0; j < arr.length; j += 2) obj[arr[j]] = arr[j + 1];
      out.push(obj);
    }
    return out;
  },
};
