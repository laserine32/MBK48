"use server";
import { db } from "@/db";
import { packs, production } from "@/db/schema";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { count, desc, eq, ilike } from "drizzle-orm";

export type ProductionType = typeof production.$inferSelect;
export type PackProductionType = Awaited<ReturnType<typeof getProductionSearchPagin>>;
export type CBPackProductionType = Awaited<ReturnType<typeof getPackProduction>>;

export const getProductionSearchPagin = async (search: string, page: number = 1) => {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const where = search ? ilike(packs.name, `%${search}%`) : undefined;
  return await db
    .select({
      id: production.id,
      packId: production.packId,
      name: packs.name,
      date: production.date,
    })
    .from(production)
    .leftJoin(packs, eq(production.packId, packs.id))
    .where(where)
    .orderBy(desc(production.date))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);
};

export const getProductionPage = async (search: string) => {
  const where = search ? ilike(packs.name, `%${search}%`) : undefined;
  const result = await db
    .select({ total: count() })
    .from(production)
    .leftJoin(packs, eq(production.packId, packs.id))
    .where(where);
  const total = Number(result[0]?.total ?? 0);
  return Math.ceil(total / ITEMS_PER_PAGE);
};

export const getPackProduction = async () => {
  const dataPacks = await db
    .select({ value: packs.id, label: packs.name, active: packs.flag })
    .from(packs)
    .where(eq(packs.flag, true))
    .orderBy(packs.name);
  const [productionPack] = await db.select().from(production).orderBy(desc(production.date)).limit(1);
  const index =
    (((dataPacks.findIndex((e) => e.value === productionPack.packId) + 1) % dataPacks.length) + dataPacks.length) %
    dataPacks.length;
  return dataPacks.map((d, i) => {
    d.active = i === index ? true : false;
    return d;
  });
};

export const addProduction = async ({ packId }: { packId: string }) => {
  try {
    await db.insert(production).values({ packId: packId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
