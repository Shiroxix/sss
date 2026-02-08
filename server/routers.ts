import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import * as brawlApi from "./brawlApi";
import * as db from "./db";

export const appRouter = router({
  // ─── Brawl Stars API ────────────────────────────────────────────
  brawl: router({
    player: publicProcedure
      .input(z.object({ tag: z.string().min(1) }))
      .query(async ({ input }) => {
        const tag = brawlApi.normalizeTag(input.tag);
        if (!brawlApi.validateTag(tag)) throw new Error("Tag inválida");
        return brawlApi.getPlayer(tag);
      }),

    club: publicProcedure
      .input(z.object({ tag: z.string().min(1) }))
      .query(async ({ input }) => {
        const tag = brawlApi.normalizeTag(input.tag);
        if (!brawlApi.validateTag(tag)) throw new Error("Tag inválida");
        return brawlApi.getClub(tag);
      }),

    battlelog: publicProcedure
      .input(z.object({ tag: z.string().min(1) }))
      .query(async ({ input }) => {
        const tag = brawlApi.normalizeTag(input.tag);
        if (!brawlApi.validateTag(tag)) throw new Error("Tag inválida");
        return brawlApi.getBattlelog(tag);
      }),

    rankings: publicProcedure
      .input(z.object({
        type: z.enum(["players", "clubs"]),
        country: z.string().default("global"),
      }))
      .query(async ({ input }) => {
        return brawlApi.getRankings(input.type, input.country);
      }),

    brawlerRankings: publicProcedure
      .input(z.object({
        country: z.string().default("global"),
        brawlerId: z.string(),
      }))
      .query(async ({ input }) => {
        return brawlApi.getBrawlerRankings(input.country, input.brawlerId);
      }),

    brawlers: publicProcedure.query(async () => {
      return brawlApi.getBrawlers();
    }),

    events: publicProcedure.query(async () => {
      return brawlApi.getEvents();
    }),

    gameModes: publicProcedure.query(async () => {
      return brawlApi.getGameModes();
    }),

    icons: publicProcedure.query(async () => {
      return brawlApi.getIcons();
    }),

    news: publicProcedure.query(async () => {
      return brawlApi.getNews();
    }),

    seasons: publicProcedure.query(async () => {
      return brawlApi.getSeasons();
    }),

    mapStats: publicProcedure
      .input(z.object({ mapId: z.number() }))
      .query(async ({ input }) => {
        return brawlApi.getMapStats(input.mapId);
      }),
  }),

  // ─── Favorites ──────────────────────────────────────────────────
  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserFavorites(ctx.user.id);
    }),

    check: protectedProcedure
      .input(z.object({ type: z.enum(["player", "club"]), tag: z.string() }))
      .query(async ({ ctx, input }) => {
        const tag = brawlApi.normalizeTag(input.tag);
        return { isFavorite: await db.isFavorite(ctx.user.id, input.type, tag) };
      }),

    add: protectedProcedure
      .input(z.object({
        type: z.enum(["player", "club"]),
        tag: z.string(),
        name: z.string().optional(),
        icon: z.string().optional(),
        trophies: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const tag = brawlApi.normalizeTag(input.tag);
        await db.addFavorite({
          userId: ctx.user.id,
          type: input.type,
          tag,
          name: input.name ?? null,
          icon: input.icon ?? null,
          trophies: input.trophies ?? 0,
          lastCheckedTrophies: input.trophies ?? 0,
        });
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ type: z.enum(["player", "club"]), tag: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const tag = brawlApi.normalizeTag(input.tag);
        await db.removeFavorite(ctx.user.id, input.type, tag);
        return { success: true };
      }),
  }),

  // ─── Auth ───────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query(({ ctx }) => {
      return ctx.user || null;
    }),
    logout: protectedProcedure.mutation(async ({ ctx }) => {
      // Session cleanup is handled by the client (cookie removal)
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
