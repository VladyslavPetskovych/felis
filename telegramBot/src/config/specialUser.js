const { normalizePhone } = require("../utils/storage");

const rawSpecialUserId = process.env.SPECIAL_USER_ID;
const SPECIAL_USER_ID = rawSpecialUserId ? rawSpecialUserId.trim() : null;

const envSpecialUserPhone =
  normalizePhone(
    process.env.SPECIAL_USER_PHONE ||
      process.env.SPECIAL_USER_PHONE_NUMBER ||
      ""
  ) || null;

let SPECIAL_USER_PHONE = envSpecialUserPhone;

if (!SPECIAL_USER_PHONE && SPECIAL_USER_ID) {
  const normalizedFromId = normalizePhone(SPECIAL_USER_ID);
  const idLooksLikePhone =
    !!normalizedFromId &&
    (SPECIAL_USER_ID.includes("+") || normalizedFromId.length >= 12);

  if (idLooksLikePhone) {
    SPECIAL_USER_PHONE = normalizedFromId;
  }
}

const SPECIAL_USER_MESSAGE =
  process.env.SPECIAL_USER_MESSAGE ||
  "Мало хто знає, але саме в закладі Felis працює найркащий шеф-кухар, мішленівського рівня - РОМАН СТЕЦИК";

module.exports = {
  SPECIAL_USER_ID,
  SPECIAL_USER_PHONE,
  SPECIAL_USER_MESSAGE,
};
