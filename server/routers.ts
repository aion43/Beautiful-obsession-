import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getDownloadLinks, saveDownloadLinks } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

export const downloadServiceSchema = z.enum(["mega", "drive", "telegram", "torrent"]);

const linkRowSchema = z.object({
  service: downloadServiceSchema,
  url: z.string().trim().max(2048).refine(
    value => value.length === 0 || /^(https?:\/\/|magnet:\?)/i.test(value),
    "Use a web URL or a magnet link.",
  ),
  isEnabled: z.boolean(),
});

export const downloadLinksInputSchema = z.object({
  links: z.array(linkRowSchema).length(4).superRefine((links, ctx) => {
    const seen = new Set<string>();
    links.forEach((link, index) => {
      if (seen.has(link.service)) {
        ctx.addIssue({ code: "custom", message: "Each delivery service can be configured only once.", path: [index, "service"] });
      }
      seen.add(link.service);
      if (link.isEnabled && !link.url) {
        ctx.addIssue({ code: "custom", message: "An enabled option needs a destination link.", path: [index, "url"] });
      }
    });
  }),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  downloadLinks: router({
    publicList: publicProcedure.query(() => getDownloadLinks()),
    list: adminProcedure.query(() => getDownloadLinks()),
    update: adminProcedure.input(downloadLinksInputSchema).mutation(async ({ input }) => {
      await saveDownloadLinks(input.links);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
