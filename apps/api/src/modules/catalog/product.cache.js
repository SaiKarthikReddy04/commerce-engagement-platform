import { createHash } from "node:crypto";
import {
  getNumber,
  incrementCounter,
} from "../../infrastructure/cache/cache.service.js";

export const PRODUCT_LIST_CACHE_TTL_SECONDS = 15;

const PRODUCT_LIST_VERSION_KEY = "commerce:catalog:v1:products:list:version";

export async function getProductListCacheVersion() {
  return getNumber(PRODUCT_LIST_VERSION_KEY, 0);
}

export async function invalidateProductLists() {
  return incrementCounter(PRODUCT_LIST_VERSION_KEY);
}

export function productListCacheKey({
  version = 0,
  page,
  limit,
  category,
  search,
  sort,
}) {
  const query = JSON.stringify([version, page, limit, category, search, sort]);
  const hash = createHash("sha256").update(query).digest("hex");

  return `commerce:catalog:v1:products:list:${hash}`;
}
