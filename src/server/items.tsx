"use server";
import { db } from "@/db";
import { items } from "@/db/schema";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { count, eq, ilike, or } from "drizzle-orm";

export type ItemsType = typeof items.$inferSelect;

export const getItemsSearchPagin = async (search: string, page: number = 1) => {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const where = search ? ilike(items.name, `%${search}%`) : undefined;
  return await db
    .select()
    .from(items)
    .where(or(eq(items.flag, true), where))
    .orderBy(items.name)
    .limit(ITEMS_PER_PAGE)
    .offset(offset);
};

export const getItemPage = async (search: string) => {
  const where = search ? ilike(items.name, `%${search}%`) : undefined;
  const result = await db
    .select({ total: count() })
    .from(items)
    .where(or(eq(items.flag, true), where));
  const total = Number(result[0]?.total ?? 0);
  return Math.ceil(total / ITEMS_PER_PAGE);
};

export const addItem = async (values: Omit<ItemsType, "flag">) => {
  try {
    await db.insert(items).values(values);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editItem = async (values: Omit<ItemsType, "flag">) => {
  try {
    await db.update(items).set(values).where(eq(items.id, values.id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteItem = async (values: Omit<ItemsType, "flag">) => {
  try {
    await db.update(items).set({ flag: false }).where(eq(items.id, values.id));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
