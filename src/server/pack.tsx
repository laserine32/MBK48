"use server";
import { db } from "@/db";
import { packs } from "@/db/schema";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { count, eq, ilike, or } from "drizzle-orm";

export type PackType = typeof packs.$inferSelect;

export const getPacksSearchPagin = async (search: string, page: number = 1) => {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const where = search ? ilike(packs.name, `%${search}%`) : undefined;
  return await db
    .select()
    .from(packs)
    .where(or(eq(packs.flag, true), where))
    .orderBy(packs.name)
    .limit(ITEMS_PER_PAGE)
    .offset(offset);
};

export const getPacksPage = async (search: string) => {
  const where = search ? ilike(packs.name, `%${search}%`) : undefined;
  const result = await db
    .select({ total: count() })
    .from(packs)
    .where(or(eq(packs.flag, true), where));
  const total = Number(result[0]?.total ?? 0);
  return Math.ceil(total / ITEMS_PER_PAGE);
};

export const addPack = async (values: Omit<PackType, "flag">) => {
  try {
    await db.insert(packs).values(values);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editPack = async (values: Omit<PackType, "flag">) => {
  try {
    await db.update(packs).set(values).where(eq(packs.id, values.id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePack = async (values: Omit<PackType, "flag">) => {
  try {
    await db.update(packs).set({ flag: false }).where(eq(packs.id, values.id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
