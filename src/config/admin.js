require("dotenv").config();
const { normalizePhone } = require("../utils/storage");

const ADMIN_PHONES = (process.env.ADMIN_PHONES || "")
  .split(",")
  .map((value) => normalizePhone(value))
  .filter(Boolean);

function isAdminPhone(phone) {
  if (!phone) return false;
  const normalized = normalizePhone(phone);
  if (!normalized) return false;
  return ADMIN_PHONES.includes(normalized);
}

module.exports = {
  ADMIN_PHONES,
  isAdminPhone,
};
