import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock brawlApi module
vi.mock("./brawlApi", () => ({
  hasToken: () => false,
  normalizeTag: (raw: string) => raw.trim().toUpperCase().replace(/^#/, "").replace(/O/g, "0"),
  validateTag: (tag: string) => /^[0289PYLQGRJCUV]{3,15}$/.test(tag),
  getPlayer: vi.fn().mockResolvedValue({
    tag: "#P90RJJY0Y",
    name: "TestPlayer",
    trophies: 25000,
    highestTrophies: 30000,
    "3vs3Victories": 1500,
    soloVictories: 200,
    brawlers: [],
    icon: { id: 28000000 },
  }),
  getClub: vi.fn().mockResolvedValue({
    tag: "#2LQRR9J",
    name: "TestClub",
    trophies: 500000,
    members: [],
    type: "open",
    requiredTrophies: 0,
  }),
  getBattlelog: vi.fn().mockResolvedValue({
    items: [
      {
        battleTime: "20260206T120000.000Z",
        event: { mode: "gemGrab", map: "Test Map" },
        battle: { result: "victory", trophyChange: 8, teams: [] },
      },
    ],
  }),
  getRankings: vi.fn().mockResolvedValue({
    items: [
      { tag: "#P90RJJY0Y", name: "Top1", trophies: 80000, icon: { id: 28000000 } },
    ],
  }),
  getBrawlerRankings: vi.fn().mockResolvedValue({
    items: [{ tag: "#ABC", name: "BrawlerTop1", trophies: 1500 }],
  }),
  getBrawlers: vi.fn().mockResolvedValue({
    list: [{ id: 16000000, name: "SHELLY", rarity: { name: "Common" } }],
  }),
  getEvents: vi.fn().mockResolvedValue({
    active: [{ slot: 1, mode: { name: "BRAWL BALL" }, map: { name: "Test Map" } }],
    upcoming: [],
  }),
  getGameModes: vi.fn().mockResolvedValue({
    list: [{ id: 48000000, name: "GEM-GRAB" }],
  }),
  getIcons: vi.fn().mockResolvedValue({
    player: { "28000000": { id: 28000000, imageUrl: "https://cdn.brawlify.com/profile-icons/regular/28000000.png" } },
  }),
}));

// Mock db module for favorites
vi.mock("./db", () => ({
  getUserFavorites: vi.fn().mockResolvedValue([]),
  isFavorite: vi.fn().mockResolvedValue(false),
  addFavorite: vi.fn().mockResolvedValue(undefined),
  removeFavorite: vi.fn().mockResolvedValue(undefined),
  updateFavoriteTrophies: vi.fn().mockResolvedValue(undefined),
  saveTrophySnapshot: vi.fn().mockResolvedValue(undefined),
  getRecentSnapshots: vi.fn().mockResolvedValue([]),
  getAllFavoritePlayers: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
  getDb: vi.fn().mockResolvedValue(null),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("brawl.health", () => {
  it("returns tokenPresent status", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.brawl.health();
    expect(result).toHaveProperty("tokenPresent");
    expect(typeof result.tokenPresent).toBe("boolean");
  });
});

describe("brawl.player", () => {
  it("returns player data for valid tag", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.brawl.player({ tag: "P90RJJY0Y" });
    expect(result).toHaveProperty("name", "TestPlayer");
    expect(result).toHaveProperty("trophies", 25000);
  });

  it("throws for invalid tag", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.brawl.player({ tag: "!!!" })).rejects.toThrow();
  });
});

describe("brawl.club", () => {
  it("returns club data for valid tag", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.brawl.club({ tag: "2LQRR9J" });
    expect(result).toHaveProperty("name", "TestClub");
    expect(result).toHaveProperty("trophies", 500000);
  });
});

describe("brawl.battlelog", () => {
  it("returns battlelog items", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.brawl.battlelog({ tag: "P90RJJY0Y" });
    expect(result).toHaveProperty("items");
    expect(result.items.length).toBeGreaterThan(0);
  });
});

describe("brawl.rankings", () => {
  it("returns player rankings for global", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.brawl.rankings({ type: "players", country: "global" });
    expect(result).toHaveProperty("items");
    expect(result.items.length).toBeGreaterThan(0);
  });
});

describe("brawl.brawlers", () => {
  it("returns brawlers list", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.brawl.brawlers();
    expect(result).toHaveProperty("list");
    expect(result.list.length).toBeGreaterThan(0);
  });
});

describe("brawl.events", () => {
  it("returns active events", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.brawl.events();
    expect(result).toHaveProperty("active");
    expect(result.active.length).toBeGreaterThan(0);
  });
});

describe("favorites", () => {
  it("requires auth for listing favorites", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.favorites.list()).rejects.toThrow();
  });

  it("lists favorites for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.favorites.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("checks favorite status for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.favorites.check({ type: "player", tag: "P90RJJY0Y" });
    expect(result).toHaveProperty("isFavorite");
    expect(typeof result.isFavorite).toBe("boolean");
  });

  it("adds a favorite for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.favorites.add({
      type: "player",
      tag: "P90RJJY0Y",
      name: "TestPlayer",
      trophies: 25000,
    });
    expect(result).toEqual({ success: true });
  });

  it("removes a favorite for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.favorites.remove({ type: "player", tag: "P90RJJY0Y" });
    expect(result).toEqual({ success: true });
  });

  it("requires auth for adding favorites", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.favorites.add({ type: "player", tag: "P90RJJY0Y" })
    ).rejects.toThrow();
  });
});
