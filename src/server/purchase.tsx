"use server";
import { db } from "@/db";
import { items, purchase, purchaseDetail } from "@/db/schema";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { createId } from "@paralleldrive/cuid2";
import { count, desc, eq } from "drizzle-orm";

export type PurchaseType = typeof purchase.$inferSelect;
export type ItemsPurchaseType = Awaited<ReturnType<typeof getItemsPurchase>>;
export type DetailPurchaseInputType = {
  itemId: string;
  item: string;
  price: number;
  qty: number;
  total: number;
};

export const getPurchaseSearchPagin = async (page: number = 1) => {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  return await db
    .select({
      id: purchase.id,
      date: purchase.date,
      items: count(purchaseDetail.itemId),
      total: purchase.total,
    })
    .from(purchase)
    .leftJoin(purchaseDetail, eq(purchase.id, purchaseDetail.purchaseId))
    .groupBy(purchase.id)
    .orderBy(desc(purchase.date))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);
};

export const getPurchasePage = async () => {
  const result = await db.select({ total: count() }).from(purchase);
  const total = Number(result[0]?.total ?? 0);
  return Math.ceil(total / ITEMS_PER_PAGE);
};

export type PurchaseDetailType = {
  itemId?: string;
  purchaseId?: string;
  qty?: number;
  cost?: number;
  total?: number;
  name?: string;
  unit?: string;
  price?: number;
};
export type DetailPurchaseType = {
  id: string;
  date: string;
  total: number;
  detail: Array<PurchaseDetailType>;
};

export const getDetailPurchase = async (id: string): Promise<DetailPurchaseType> => {
  const dataDetail = await db
    .select({ purchase, purchaseDetail, items })
    .from(purchase)
    .leftJoin(purchaseDetail, eq(purchase.id, purchaseDetail.purchaseId))
    .leftJoin(items, eq(purchaseDetail.itemId, items.id))
    .where(eq(purchase.id, id));
  // console.log(dataDetail);
  type ResultType = {
    [key: string]: {
      id: string;
      date: string;
      total: number;
      detail: Array<PurchaseDetailType>;
    };
  };
  const [result] = Object.values(
    dataDetail.reduce((acc: ResultType, d) => {
      const id = d.purchase.id;

      if (!acc[id]) {
        acc[id] = {
          id: d.purchase.id,
          date: d.purchase.date,
          total: d.purchase.total,
          detail: [],
        };
      }

      acc[id].detail.push({
        itemId: d.purchaseDetail?.itemId,
        purchaseId: d.purchaseDetail?.purchaseId,
        qty: d.purchaseDetail?.qty,
        cost: d.purchaseDetail?.cost,
        total: d.purchaseDetail?.total,
        name: d.items?.name,
        unit: d.items?.unit,
        price: d.items?.price,
      });

      return acc;
    }, {})
  );
  return result;
};

export const getItemsPurchase = async () => {
  const dataPacks = await db
    .select({ value: items.id, label: items.name, price: items.price })
    .from(items)
    .where(eq(items.flag, true))
    .orderBy(items.name);
  return dataPacks;
};

export const addPurchase = async (data: Array<DetailPurchaseInputType>, total: number) => {
  try {
    const purchaseId = createId();
    await db.insert(purchase).values({ id: purchaseId, total: total });
    try {
      const dataDetail = data.map((e) => ({
        itemId: e.itemId,
        purchaseId: purchaseId,
        qty: e.qty,
        cost: e.price,
        total: e.total,
      }));
      await db.insert(purchaseDetail).values(dataDetail);
    } catch (error) {
      console.error(error);
      await db.delete(purchase).where(eq(purchase.id, purchaseId));
      throw error;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
