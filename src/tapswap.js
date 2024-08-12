import { request } from "./utils.js";

const ONE_HOUR_IN_SECONDS = 3600;
const FIVE_MINUTES_IN_SECONDS = 300;

const headers = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.5",
  "cache-control": "no-cache",
  "content-type": "application/json",
  pragma: "no-cache",
  priority: "u=1, i",
  "sec-ch-ua-mobile": "?1",
  "sec-ch-ua-platform": '"android"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "x-app": "tapswap_server",
  "x-cv": "", //build version //TonWalletButton this.log.info("[AppContext] buildNum: 652"),
  "x-touch": "1",
  Referer: "https://app.tapswap.club/",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.64 Mobile Safari/537.36",
};

export async function submitTaps(token, playerId, taps) {
  const timestamp = Date.now();
  return request(
    "POST",
    "https://api.tapswap.club/api/player/submit_taps",
    {
      ...headers,
      authorization: `Bearer ${token}`,
      "cache-id": makeRandomString(8),
      "content-id": hs(playerId, timestamp).toString(),
    },
    false,
    JSON.stringify({ taps, time: timestamp })
  );
}

export async function applyBoost(token, type) {
  return request(
    "POST",
    "https://api.tapswap.club/api/player/apply_boost",
    {
      ...headers,
      authorization: `Bearer ${token}`,
      "cache-id": makeRandomString(8),
    },
    false,
    JSON.stringify({ type })
  );
}

export function checkLogin(loginTs) {
  let now = Date.now();
  return (
    loginTs + ONE_HOUR_IN_SECONDS * 1e3 - now <= FIVE_MINUTES_IN_SECONDS * 1e3
  );
}

export function hs(e, n) {
  return (e * n) % e;
}

export function makeRandomString(
  length,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) {
  let result = "";
  const charsetLength = charset.length;
  for (let i = 0; i < length; i++)
    result += charset.charAt(Math.floor(Math.random() * charsetLength));
  return result;
}
