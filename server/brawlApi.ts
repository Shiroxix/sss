import axios from "axios";
import { ENV } from "./_core/env";
import { SEASONS_DATA } from "./seasonsData";

// ─── Cache ────────────────────────────────────────────────────────
const cache = new Map<string, { data: unknown; ts: number }>();
const SHORT_TTL = 60_000;       // 1 min for player/club/battlelog
const MEDIUM_TTL = 300_000;     // 5 min for rankings
const LONG_TTL = 3_600_000;     // 1 hour for static data (brawlers, icons, modes)
const EVENT_TTL = 600_000;      // 10 min for events

function cached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < ttl) return Promise.resolve(entry.data as T);
  return fetcher().then((data) => {
    cache.set(key, { data, ts: Date.now() });
    return data;
  });
}

// ─── Official API (requires BRAWL_TOKEN) ──────────────────────────
const OFFICIAL_BASE = "https://api.brawlstars.com/v1";
const BRAWLAPI_BASE = "https://api.brawlapi.com/v1";

function officialHeaders() {
  const token = (ENV.brawlToken || "").trim();
  const h: Record<string, string> = { Accept: "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

function hasToken(): boolean {
  return Boolean((ENV.brawlToken || "").trim());
}

export function normalizeTag(raw: string): string {
  let t = raw.trim().toUpperCase().replace(/^#/, "").replace(/O/g, "0");
  return t;
}

export function validateTag(tag: string): boolean {
  return /^[0289PYLQGRJCUV]{3,15}$/.test(tag);
}

// Fallback data for when API token is missing
const FALLBACK_PLAYER = {
  name: "Jogador (Sem Token)",
  tag: "#000000",
  trophies: 0,
  highestTrophies: 0,
  expLevel: 0,
  "3vs3Victories": 0,
  soloVictories: 0,
  duoVictories: 0,
  brawlers: []
};

export async function getPlayer(tag: string) {
  const t = normalizeTag(tag);
  
  return cached(`player:${t}`, SHORT_TTL, async () => {
    const res = await axios.get(`${OFFICIAL_BASE}/players/%23${encodeURIComponent(t)}`, {
      headers: officialHeaders(),
      timeout: 8000,
    });
    return res.data;
  });
}

export async function getClub(tag: string) {
  const t = normalizeTag(tag);

  return cached(`club:${t}`, SHORT_TTL, async () => {
    const res = await axios.get(`${OFFICIAL_BASE}/clubs/%23${encodeURIComponent(t)}`, {
      headers: officialHeaders(),
      timeout: 8000,
    });
    return res.data;
  });
}

export async function getBattlelog(tag: string) {
  const t = normalizeTag(tag);

  return cached(`battlelog:${t}`, SHORT_TTL, async () => {
    const res = await axios.get(`${OFFICIAL_BASE}/players/%23${encodeURIComponent(t)}/battlelog`, {
      headers: officialHeaders(),
      timeout: 8000,
    });
    return res.data;
  });
}

export async function getRankings(type: "players" | "clubs", country: string) {
  const c = country.toLowerCase();
  const path = c === "global" ? `/rankings/global/${type}` : `/rankings/${c}/${type}`;
  
  return cached(`rank:${type}:${c}`, MEDIUM_TTL, async () => {
    const res = await axios.get(`${OFFICIAL_BASE}${path}`, {
      headers: officialHeaders(),
      timeout: 8000,
    });
    return res.data;
  });
}

export async function getBrawlerRankings(country: string, brawlerId: string) {
  const c = country.toLowerCase();
  const path = c === "global"
    ? `/rankings/global/brawlers/${brawlerId}`
    : `/rankings/${c}/brawlers/${brawlerId}`;
    
  return cached(`rank:brawlers:${c}:${brawlerId}`, MEDIUM_TTL, async () => {
    const res = await axios.get(`${OFFICIAL_BASE}${path}`, {
      headers: officialHeaders(),
      timeout: 8000,
    });
    return res.data;
  });
}

// ─── BrawlAPI (unofficial, no key needed) ─────────────────────────
export async function getBrawlers() {
  return cached("brawlapi:brawlers", LONG_TTL, async () => {
    const res = await axios.get(`${BRAWLAPI_BASE}/brawlers`, { timeout: 10000 });
    return res.data;
  });
}

export async function getEvents() {
  return cached("brawlapi:events", EVENT_TTL, async () => {
    const res = await axios.get(`${BRAWLAPI_BASE}/events`, { timeout: 10000 });
    return res.data;
  });
}

export async function getMapStats(mapId: number) {
  return cached(`brawlapi:mapstats:${mapId}`, EVENT_TTL, async () => {
    const res = await axios.get(`${BRAWLAPI_BASE}/maps/${mapId}`, { timeout: 10000 });
    return res.data;
  });
}

export async function getGameModes() {
  return cached("brawlapi:gamemodes", LONG_TTL, async () => {
    const res = await axios.get(`${BRAWLAPI_BASE}/gamemodes`, { timeout: 10000 });
    return res.data;
  });
}

export async function getIcons() {
  return cached("brawlapi:icons", LONG_TTL, async () => {
    const res = await axios.get(`${BRAWLAPI_BASE}/icons`, { timeout: 10000 });
    return res.data;
  });
}

export async function getNews() {
  return getEvents();
}

export async function getSeasons() {
  // Always return the static data we defined
  return SEASONS_DATA;
}

export { hasToken };
