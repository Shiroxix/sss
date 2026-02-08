import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, favorites, InsertFavorite, trophySnapshots, InsertTrophySnapshot } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Favorites ────────────────────────────────────────────────────
export async function addFavorite(data: InsertFavorite) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(favorites).values(data).onDuplicateKeyUpdate({
    set: { name: data.name, icon: data.icon, trophies: data.trophies, updatedAt: new Date() },
  });
}

export async function removeFavorite(userId: number, type: "player" | "club", tag: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(favorites).where(
    and(eq(favorites.userId, userId), eq(favorites.type, type), eq(favorites.tag, tag))
  );
}

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt));
}

export async function isFavorite(userId: number, type: "player" | "club", tag: string) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(favorites).where(
    and(eq(favorites.userId, userId), eq(favorites.type, type), eq(favorites.tag, tag))
  ).limit(1);
  return result.length > 0;
}

export async function updateFavoriteTrophies(userId: number, tag: string, trophies: number, name?: string) {
  const db = await getDb();
  if (!db) return;
  const set: Record<string, unknown> = { trophies, lastCheckedTrophies: trophies, updatedAt: new Date() };
  if (name) set.name = name;
  await db.update(favorites).set(set).where(
    and(eq(favorites.userId, userId), eq(favorites.tag, tag))
  );
}

// ─── Trophy Snapshots ─────────────────────────────────────────────
export async function saveTrophySnapshot(data: InsertTrophySnapshot) {
  const db = await getDb();
  if (!db) return;
  await db.insert(trophySnapshots).values(data);
}

export async function getRecentSnapshots(tag: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(trophySnapshots).where(eq(trophySnapshots.tag, tag)).orderBy(desc(trophySnapshots.createdAt)).limit(limit);
}

export async function getAllFavoritePlayers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(favorites).where(eq(favorites.type, "player"));
}
