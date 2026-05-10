"use server";
import { db } from "@/db";
import { packInUse, packs, production, purchase } from "@/db/schema";
import {
  calcTrend,
  formatedDate,
  getDashboardItemScore,
  getDaysSpent,
  getPackRatio,
  getRankMessage,
} from "@/lib/dashboard-utils";
import { formatCurrency, formatDateToLocal } from "@/lib/utils";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

export type BarChartType = Awaited<ReturnType<typeof getMainChart>>;
export type DashboardScoreType = Awaited<ReturnType<typeof getScore>>;

export const fetchDashboardCardData = async () => {
  const daysspent = getDaysSpent();
  const fexpenses = await getExpenses();
  const fproduced = await getProduction();
  const fpackinuse = await getPackInUse();
  const lastPurchase = await getLastPurchase();
  const { monthExpenses, trendExpenses, monthProduce, trendProduction, monthInuse, trendInuse, monthDaysPassed } =
    await monthlyCard();
  const countPack = await getCountPack();
  const ratioPack = getPackRatio(fproduced, fpackinuse.total, countPack);

  return {
    expenses: {
      total: fexpenses,
      day: [`\u00b1 ${formatCurrency(fexpenses / daysspent.day)} / days`, `Last Purchase : ${lastPurchase}`],
    },
    produced: {
      total: fproduced,
      day: `\u00b1 ${Math.round(fproduced / daysspent.day).toLocaleString("id-ID")} / days`,
    },
    packinuse: {
      total: fpackinuse.name,
      day: `total : ${fpackinuse.total} \u00b1 ${Math.round(fpackinuse.total / daysspent.day).toLocaleString(
        "id-ID"
      )} / days`,
    },
    daysspent: daysspent,
    monthExpenses: {
      total: monthExpenses,
      day: [`\u00b1 ${formatCurrency(monthExpenses / monthDaysPassed)} / days`, trendExpenses],
    },
    monthProduced: {
      total: monthProduce,
      day: [`\u00b1 ${Math.round(monthProduce / monthDaysPassed).toLocaleString("id-ID")} / days`, trendProduction],
    },
    monthInuse: {
      total: monthInuse,
      day: [`\u00b1 ${Math.round(monthInuse / monthDaysPassed).toLocaleString("id-ID")} / days`, trendInuse],
    },
    ratioPack: ratioPack,
  };
};

const monthlyCard = async () => {
  try {
    // const date: Date = new Date("2025-12-01");
    const date: Date = new Date();
    const daysPassed: number = date.getDate();
    const f1 = formatedDate(date);
    const tt = new Date(date);
    const prevDate: Date = new Date(tt.setMonth(tt.getMonth() - 1));
    const f2 = formatedDate(prevDate);

    const expenses = await db
      .select({ month: sql`TO_CHAR(date, 'YYYY-MM')`, total: sum(purchase.total).mapWith(Number) })
      .from(purchase)
      .where(and(gte(purchase.date, f2.dateStart.toISOString()), lte(purchase.date, f1.dateEnd.toISOString())))
      .groupBy(sql`TO_CHAR(date, 'YYYY-MM')`)
      .orderBy(sql`1 DESC`);
    const { currentValue: monthExpenses, message: trendExpenses } = calcTrend(expenses.map((e) => e.total));
    const prod = await db
      .select({ month: sql`TO_CHAR(date, 'YYYY-MM')`, total: count() })
      .from(production)
      .where(and(gte(production.date, f2.dateStart.toISOString()), lte(production.date, f1.dateEnd.toISOString())))
      .groupBy(sql`TO_CHAR(date, 'YYYY-MM')`)
      .orderBy(sql`1 DESC`);
    const { currentValue: monthProduce, message: trendProduction } = calcTrend(prod.map((e) => e.total));
    const inuse = await db
      .select({ month: sql`TO_CHAR(time_start, 'YYYY-MM')`, total: count() })
      .from(packInUse)
      .where(
        and(gte(packInUse.timeStart, f2.dateStart.toISOString()), lte(packInUse.timeStart, f1.dateEnd.toISOString()))
      )
      .groupBy(sql`TO_CHAR(time_start, 'YYYY-MM')`)
      .orderBy(sql`1 DESC`);
    const { currentValue: monthInuse, message: trendInuse } = calcTrend(inuse.map((e) => e.total));
    return {
      monthExpenses: Number(monthExpenses),
      trendExpenses: trendExpenses,
      monthProduce: monthProduce,
      trendProduction: trendProduction,
      monthInuse: monthInuse,
      trendInuse: trendInuse,
      monthDaysPassed: daysPassed,
    };
  } catch (error) {
    console.error(error);
    return {
      monthExpenses: 0,
      trendExpenses: "",
      monthProduce: 0,
      trendProduction: "",
      monthInuse: 0,
      trendInuse: "",
      monthDaysPassed: 0,
    };
  }
};

const getLastPurchase = async () => {
  try {
    const [{ tgl }] = await db.select({ tgl: purchase.date }).from(purchase).orderBy(desc(purchase.date)).limit(1);
    return formatDateToLocal(tgl);
  } catch (error) {
    console.error(error);
    return "";
  }
};

const getPackInUse = async () => {
  try {
    const [data] = await db
      .select({ name: packs.name })
      .from(packInUse)
      .leftJoin(packs, eq(packInUse.packId, packs.id))
      .where(eq(packInUse.flag, true));
    const [{ total }] = await db.select({ total: count() }).from(packInUse);
    return { name: data?.name, total: total };
  } catch (error) {
    console.error(error);
    return { name: "", total: 0 };
  }
};

const getProduction = async (): Promise<number> => {
  try {
    const [{ total }] = await db.select({ total: count() }).from(production);
    return Number(total);
  } catch (error) {
    console.error(error);
    return 0;
  }
};

const getExpenses = async (): Promise<number> => {
  try {
    const [{ total }] = await db.select({ total: sum(purchase.total) }).from(purchase);
    return Number(total);
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getCountPack = async () => {
  try {
    const [{ total }] = await db.select({ total: count() }).from(packs).where(eq(packs.flag, true));
    return Number(total);
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getMainChart = async (year: string) => {
  try {
    const start_date = new Date(`${year}-01-01`);
    const end_date = new Date(`${year}-12-31`);
    const dataPurchase = await db
      .select({
        month: sql`TO_CHAR(DATE_TRUNC('month', date), 'Month')`.mapWith(String),
        purchase: sum(purchase.total).mapWith(Number),
      })
      .from(purchase)
      .where(and(gte(purchase.date, start_date.toISOString()), lte(purchase.date, end_date.toISOString())))
      .groupBy(sql`DATE_TRUNC('month', date)`)
      .orderBy(sql`DATE_TRUNC('month', date)`);
    // console.log(dataPurchase);
    const dataProduction = await db
      .select({
        month: sql`TO_CHAR(DATE_TRUNC('month', date), 'Month')`.mapWith(String),
        production: count(),
      })
      .from(production)
      .where(and(gte(production.date, start_date.toISOString()), lte(production.date, end_date.toISOString())))
      .groupBy(sql`DATE_TRUNC('month', date)`)
      .orderBy(sql`DATE_TRUNC('month', date)`);
    // console.log(dataProduction);
    const dataPackInUse = await db
      .select({
        month: sql`TO_CHAR(DATE_TRUNC('month', time_start), 'Month')`.mapWith(String),
        packinuse: count(),
      })
      .from(packInUse)
      .where(and(gte(packInUse.timeStart, start_date.toISOString()), lte(packInUse.timeStart, end_date.toISOString())))
      .groupBy(sql`DATE_TRUNC('month', time_start)`)
      .orderBy(sql`DATE_TRUNC('month', time_start)`);
    // console.log(dataPackInUse);
    type DataItem = typeof dataPurchase | typeof dataProduction | typeof dataPackInUse;
    type Result = {
      month: string;
      purchase?: number;
      production?: number;
      packinuse?: number;
    };
    const map = new Map<string, Result>();
    const mergeData = (data: DataItem) => {
      data.forEach((item) => {
        const existing = map.get(item.month) || {
          month: item.month,
        };
        map.set(item.month, {
          ...existing,
          ...item,
        });
      });
    };
    mergeData(dataPurchase);
    mergeData(dataProduction);
    mergeData(dataPackInUse);

    return Array.from(map.values());
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getPurchaseScoreData = async () => {
  const { rows } = await db.execute(sql`
  WITH monthly_totals AS (
      SELECT 
          DATE_TRUNC('month', date) AS month,
          SUM(total) AS total_value,
          DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE) AS is_current_month
      FROM "Purchase"
      WHERE date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY DATE_TRUNC('month', date)
  )
  SELECT 
      ROUND(AVG(total_value) FILTER (WHERE NOT is_current_month))::INT AS avg,
      COALESCE(MAX(total_value) FILTER (WHERE is_current_month), 0)::INT AS sum
  FROM monthly_totals;`);
  return rows[0];
};

const getPackInUseScoreData = async () => {
  const { rows } = await db.execute(sql`
  WITH monthly_totals AS (
      SELECT 
          DATE_TRUNC('month', time_start) AS month,
          COUNT(*) AS total_value,
          DATE_TRUNC('month', time_start) = DATE_TRUNC('month', CURRENT_DATE) AS is_current_month
      FROM "PackInUse"
      WHERE time_start < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY DATE_TRUNC('month', time_start)
  )
  SELECT 
      ROUND(AVG(total_value) FILTER (WHERE NOT is_current_month))::INT AS avg,
      COALESCE(MAX(total_value) FILTER (WHERE is_current_month), 0)::INT AS sum
  FROM monthly_totals;`);
  return rows[0];
};

export const getScore = async () => {
  try {
    const date: Date = new Date();
    const daysPassed: number = date.getDate();
    const daysInMonth: number = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const purchaseScoreData = await getPurchaseScoreData();
    const packInUseScoreData = await getPackInUseScoreData();

    const purchaseScore = getDashboardItemScore(purchaseScoreData.avg, purchaseScoreData.sum);
    const packInUseScore = getDashboardItemScore(packInUseScoreData.avg, packInUseScoreData.sum);
    const prediction = (Number(packInUseScoreData.sum) / daysPassed) * daysInMonth;
    const predictionScore = getDashboardItemScore(packInUseScoreData.avg, prediction, true);
    const totalScore = purchaseScore * 0.25 + packInUseScore * 0.25 + predictionScore * 0.5;

    type msgTotalScoreType = {
      rank: string;
      message: string;
    };
    const msgTotalScore: msgTotalScoreType = getRankMessage(totalScore, {
      excellent: `Good job! Must keep it up.`,
      good: `You're doing okay, but can do better!`,
      warning: `It can still be fixed.`,
      danger: `Needs special attention immediately!`,
    });
    const msgPurchaseScore = {
      title: `Spending Control`,
      ...getRankMessage(purchaseScore, {
        excellent: `Excellent`,
        good: `Good`,
        warning: `More Frugal`,
        danger: `What happened?`,
      }),
    };
    const msgPackInUseScore = {
      title: `Consumtion Level`,
      ...getRankMessage(packInUseScore, {
        excellent: `Excellent`,
        good: `Good`,
        warning: `Please lower it`,
        danger: `What happened?`,
      }),
    };
    const msgPredictionScore = {
      title: `Prediction Score`,
      ...getRankMessage(predictionScore, {
        excellent: `Excellent`,
        good: `Good`,
        warning: `Please lower it`,
        danger: `What happened?`,
      }),
    };
    return {
      summary: {
        score: Math.floor(totalScore),
        description: msgTotalScore as msgTotalScoreType,
      },
      scores: {
        totalScore,
        purchaseScore,
        packInUseScore,
        predictionScore,
      },
      messages: [msgPurchaseScore, msgPackInUseScore, msgPredictionScore],
    };
  } catch (error) {
    console.error(error);
    return {
      summary: {
        score: 0,
        description: { rank: ``, message: `` },
      },
      scores: {},
      messages: [],
    };
  }
};
