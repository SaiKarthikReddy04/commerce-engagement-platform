import { getRedisClient } from "../../config/redis.js";

let hasWarned = false;

function warnOnce(error) {
  if (hasWarned) return;

  hasWarned = true;
  console.warn(
    `Cache operation failed; continuing without cache. ${error.message}`,
  );
}

export async function getJson(key) {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const value = await client.get(key);
    if (value === null) return null;

    const parsed = JSON.parse(value);
    hasWarned = false;
    return parsed;
  } catch (error) {
    warnOnce(error);
    return null;
  }
}

export async function setJson(key, value, ttlSeconds = 60) {
  const client = getRedisClient();
  if (!client) return false;

  try {
    const ttl = Math.max(1, Math.floor(Number(ttlSeconds) || 60));
    await client.set(key, JSON.stringify(value), { EX: ttl });

    hasWarned = false;
    return true;
  } catch (error) {
    warnOnce(error);
    return false;
  }
}

export async function deleteCacheKey(key) {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);

    hasWarned = false;
    return true;
  } catch (error) {
    warnOnce(error);
    return false;
  }
}

export async function getNumber(key, fallback = 0) {
  const client = getRedisClient();
  if (!client) return fallback;

  try {
    const value = await client.get(key);
    if (value === null) return fallback;

    const number = Number(value);
    if (!Number.isSafeInteger(number)) return fallback;

    hasWarned = false;
    return number;
  } catch (error) {
    warnOnce(error);
    return fallback;
  }
}

export async function incrementCounter(key) {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const value = await client.incr(key);

    hasWarned = false;
    return value;
  } catch (error) {
    warnOnce(error);
    return null;
  }
}
