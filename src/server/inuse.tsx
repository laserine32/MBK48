"use server";
import { db } from "@/db";
import { packInUse, packs } from "@/db/schema";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { count, desc, eq, ilike, sql } from "drizzle-orm";

export type InuseType = typeof packInUse.$inferSelect;
export type PackInUseType = Awaited<ReturnType<typeof getInUsedSearchPagin>>;
export type CBPackInUseType = Awaited<ReturnType<typeof getPackInUse>>;

export const getInUsedSearchPagin = async (search: string, page: number = 1) => {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const where = search ? ilike(packs.name, `%${search}%`) : undefined;
  return await db
    .select({
      id: packInUse.id,
      packId: packInUse.packId,
      name: packs.name,
      timeStart: packInUse.timeStart,
      timeEnd: packInUse.timeEnd,
      flag: packInUse.flag,
    })
    .from(packInUse)
    .leftJoin(packs, eq(packInUse.packId, packs.id))
    .where(where)
    .orderBy(desc(packInUse.timeStart))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);
};

export const getInUsedPage = async (search: string) => {
  const where = search ? ilike(packs.name, `%${search}%`) : undefined;
  const result = await db
    .select({ total: count() })
    .from(packInUse)
    .leftJoin(packs, eq(packInUse.packId, packs.id))
    .where(where);
  const total = Number(result[0]?.total ?? 0);
  return Math.ceil(total / ITEMS_PER_PAGE);
};

export const getPackInUse = async () => {
  const dataPacks = await db
    .select({ value: packs.id, label: packs.name, active: packs.flag })
    .from(packs)
    .where(eq(packs.flag, true))
    .orderBy(packs.name);
  const [inusePack] = await db.select().from(packInUse).where(eq(packInUse.flag, true));
  const index =
    (((dataPacks.findIndex((e) => e.value === inusePack.packId) + 1) % dataPacks.length) + dataPacks.length) %
    dataPacks.length;
  return dataPacks.map((d, i) => {
    d.active = i === index ? true : false;
    return d;
  });
};

export const addInUse = async ({ packId }: { packId: string }) => {
  try {
    await db.execute(sql`
      WITH updated AS (
        UPDATE "PackInUse"
        SET "flag" = false,
            "time_end" = NOW()
        WHERE "flag" = true
      )
      INSERT INTO "PackInUse" ("packId", "time_start", "time_end", "flag")
      VALUES (${packId}, NOW(), NOW(), true);
    `);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
