import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint, json, uniqueIndex } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Favorites: players or clubs saved by authenticated users */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["player", "club"]).notNull(),
  tag: varchar("tag", { length: 32 }).notNull(),
  name: varchar("name", { length: 128 }),
  icon: varchar("icon", { length: 512 }),
  trophies: int("trophies").default(0),
  lastCheckedTrophies: int("lastCheckedTrophies").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("user_type_tag_idx").on(table.userId, table.type, table.tag),
]);

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/** Trophy snapshots for tracking milestones */
export const trophySnapshots = mysqlTable("trophy_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  tag: varchar("tag", { length: 32 }).notNull(),
  trophies: int("trophies").notNull(),
  highestTrophies: int("highestTrophies").default(0),
  data: json("data"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrophySnapshot = typeof trophySnapshots.$inferSelect;
export type InsertTrophySnapshot = typeof trophySnapshots.$inferInsert;
