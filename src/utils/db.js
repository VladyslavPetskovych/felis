// src/db.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const kUser = (id) => `user:${id}`;
const kPhone = (num) => `phone:${num}`;
const idxPhones = 'idx:phones';

async function ensureIndexes() {
  try { await redis.call('FT.INFO', idxPhones); return; } catch (_) {}
  await redis.call(
    'FT.CREATE', idxPhones, 'ON', 'HASH', 'PREFIX', '1', 'phone:',
    'SCHEMA',
    'number', 'TAG', 'AS', 'number',
    'name', 'TEXT',
    'meta', 'TEXT'
  );
}

module.exports = {
  ensureIndexes,
  async saveUser(id, data) { await redis.set(kUser(id), JSON.stringify(data)); },
  async getUser(id) { const v = await redis.get(kUser(id)); return v ? JSON.parse(v) : null; },
  async addPhone(number, payload) { await redis.hset(kPhone(number), { number, ...payload }); },
  async getPhone(number) { const v = await redis.hgetall(kPhone(number)); return Object.keys(v).length ? v : null; },
  async searchPhones(q) {
    const query = (q.startsWith('+') || /\d/.test(q))
      ? `@number:{${q.replaceAll('*','\\*')}*}`
      : `@name:(${q})`;
    const res = await redis.call('FT.SEARCH', idxPhones, query, 'LIMIT', '0', '10');
    // res формат: [total, key, [field, value, ...], ...]
    const out = [];
    for (let i = 2; i < res.length; i += 2) {
      const arr = res[i+1];
      const obj = {};
      for (let j = 0; j < arr.length; j += 2) obj[arr[j]] = arr[j+1];
      out.push(obj);
    }
    return out;
  }
};
