import { createClient } from "redis";

let redisClient;
let hasWarned = false;

function warnUnavailable(error) {
  if (hasWarned) return;

  hasWarned = true;
  console.warn(
    `Redis is unavailable; the API will continue without caching. ${error.message}`,
  );
}

export function getRedisClient() {
  return redisClient?.isReady ? redisClient : null;
}

export function connectRedis() {
  const { REDIS_URL } = process.env;

  if (!REDIS_URL) {
    console.warn("REDIS_URL is not set; caching is disabled.");
    return;
  }

  if (redisClient?.isOpen) return;

  redisClient = createClient({
    url: REDIS_URL,
    socket: {
      connectTimeout: 3000,
      reconnectStrategy(retries) {
        return Math.min(retries * 500, 5000);
      },
    },
  });

  redisClient.on("error", warnUnavailable);

  redisClient.on("ready", () => {
    hasWarned = false;
    console.log("Connected to Redis.");
  });

  redisClient.connect().catch(warnUnavailable);
}
