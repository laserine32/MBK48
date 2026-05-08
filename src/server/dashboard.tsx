import { db } from "@/db";
import { packInUse, packs, production, purchase } from "@/db/schema";
import { formatCurrency, formatDateToLocal } from "@/lib/utils";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

export type MainChartFunctionType = Awaited<ReturnType<typeof getMainChart>>;

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

const formatedDate = (tgl: Date) => {
  const year: number = tgl.getFullYear();
  const month: string = (tgl.getMonth() + 1).toString().padStart(2, "0");
  const lastDay = new Date(tgl.getFullYear(), tgl.getMonth() + 1, 0).getDate().toString().padStart(2, "0");
  const formatedStart = `${year}-${month}-01`;
  const formatedEnd = `${year}-${month}-${lastDay}`;
  return {
    dateStart: new Date(formatedStart),
    dateEnd: new Date(formatedEnd),
    formatedStart: formatedStart,
    formatedEnd: formatedEnd,
    formated: `${year}-${month}`,
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

const getDaysSpent = () => {
  const today: Date = new Date();
  const targetDate: Date = new Date("2024-12-25");

  if (Number.isNaN(targetDate.getTime())) {
    return { days: "0 Days", spell: "Invalid date format", day: 0 };
  }

  let differenceMs: number = Math.abs(today.getTime() - targetDate.getTime());
  const tdifferenceMs: number = differenceMs;

  const msInDay: number = 24 * 60 * 60 * 1000;
  const msInWeek: number = 7 * msInDay;
  const msInMonth: number = 30 * msInDay;
  const msInYear: number = 365 * msInDay;

  const years: number = Math.floor(differenceMs / msInYear);
  differenceMs %= msInYear;

  const months: number = Math.floor(differenceMs / msInMonth);
  differenceMs %= msInMonth;

  const weeks: number = Math.floor(differenceMs / msInWeek);
  differenceMs %= msInWeek;

  const daysRemainder: number = Math.floor(differenceMs / msInDay);

  type ParamKey = "y" | "m" | "w" | "d";

  const spelledOut = (valueCount: number, paramKey: ParamKey): string => {
    if (valueCount === 1) {
      if (paramKey === "y") return "A Year";
      if (paramKey === "m") return "A Month";
      if (paramKey === "w") return "A Week";
      if (paramKey === "d") return "A Day";
    }
    if (valueCount > 1) {
      if (paramKey === "y") return `${years} Years`;
      if (paramKey === "m") return `${months} Months`;
      if (paramKey === "w") return `${weeks} Weeks`;
      if (paramKey === "d") return `${daysRemainder} Days`;
    }
    return "";
  };

  const weeksValueForSpelling: number = weeks; // keeps original variable meaning
  void weeksValueForSpelling;

  const resultParts: string[] = [
    spelledOut(years, "y"),
    spelledOut(months, "m"),
    spelledOut(weeks, "w"),
    spelledOut(daysRemainder, "d"),
  ].filter((partStr: string) => Boolean(partStr));

  const resultText: string = resultParts.join(" ") || "";

  const ddayDaysTotalInt64SafeApproximation: number = Math.floor(tdifferenceMs / msInDay);

  // const prevMonth = today.setMonth(today.getMonth() - 1);
  // const tt: Date = new Date();
  // const prevDate: Date = new Date(tt.setMonth(tt.getMonth() - 1));
  // const formattedPrev: string = formatedDate(prevDate);

  return {
    days: String(ddayDaysTotalInt64SafeApproximation) + ` Days`,
    spell: resultText || "a Day",
    day: ddayDaysTotalInt64SafeApproximation,
    // formated: formatedDate(today),
    // formattedPrev: formattedPrev,
  };
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

export const getPackRatio = (fproduced: number, fpackinuse: number, pack: number) => {
  // const [fproduced, { total: fpackinuse }, pack] = await Promise.all([getProduction(), getPackInUse(), getCountPack()]);
  const gap = Math.abs(fpackinuse - fproduced);
  const producedGreater = fproduced > fpackinuse;
  const inuse = producedGreater ? pack - gap : pack - (pack - gap);
  const percent = (inuse / pack) * 100;

  return {
    inuse: inuse,
    prod: producedGreater ? pack - (pack - gap) : pack - gap,
    percent: percent,
  };
};

export const getMainChart = async () => {
  try {
    const dataPurchase = await db
      .select({
        tgl: sql`TO_CHAR(date, 'YYYY-MM')`.mapWith(String),
        month: sql`TO_CHAR(date, 'Month')`.mapWith(String),
        year: sql`TO_CHAR(date, 'YYYY')`.mapWith(String),
        purchase: sum(purchase.total).mapWith(Number),
      })
      .from(purchase)
      .groupBy(sql.raw(`TO_CHAR(date, 'YYYY-MM'), TO_CHAR(date, 'Month'), TO_CHAR(date, 'YYYY')`))
      .orderBy(sql`1`);
    // console.log(dataPurchase);
    const dataProduction = await db
      .select({
        tgl: sql`TO_CHAR(date, 'YYYY-MM')`.mapWith(String),
        month: sql`TO_CHAR(date, 'Month')`.mapWith(String),
        year: sql`TO_CHAR(date, 'YYYY')`.mapWith(String),
        production: count(),
      })
      .from(production)
      .groupBy(sql.raw(`TO_CHAR(date, 'YYYY-MM'), TO_CHAR(date, 'Month'), TO_CHAR(date, 'YYYY')`))
      .orderBy(sql`1`);
    // console.log(dataProduction);
    const dataPackInUse = await db
      .select({
        tgl: sql`TO_CHAR(time_start, 'YYYY-MM')`.mapWith(String),
        month: sql`TO_CHAR(time_start, 'Month')`.mapWith(String),
        year: sql`TO_CHAR(time_start, 'YYYY')`.mapWith(String),
        consume: count(),
      })
      .from(packInUse)
      .groupBy(sql.raw(`TO_CHAR(time_start, 'YYYY-MM'), TO_CHAR(time_start, 'Month'), TO_CHAR(time_start, 'YYYY')`))
      .orderBy(sql`1`);
    // console.log(dataPackInUse);
    type DataItem = typeof dataPurchase | typeof dataProduction | typeof dataPackInUse;
    type Result = {
      tgl: string;
      month: string;
      year: string;
      purchase?: number;
      production?: number;
      consume?: number;
    };
    const map = new Map<string, Result>();
    const mergeData = (data: DataItem) => {
      data.forEach((item) => {
        const existing = map.get(item.tgl) || {
          tgl: item.tgl,
          month: item.month,
          year: item.year,
        };

        map.set(item.tgl, {
          ...existing,
          ...item,
        });
      });
    };
    mergeData(dataPurchase);
    mergeData(dataProduction);
    mergeData(dataPackInUse);

    const fexpenses = dataPurchase.reduce((acm, cui) => {
      return acm + cui.purchase;
    }, 0);
    const fproduced = dataProduction.reduce((acm, cui) => {
      return acm + cui.production;
    }, 0);

    return {
      fexpenses: fexpenses,
      fproduced: fproduced,
      mainChart: Array.from(map.values()),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const calcTrend = (data: Array<number>) => {
  if (data.length == 1) {
    return {
      currentValue: data[0],
      trendValue: 0,
      message: "",
    };
  }
  const trendValue = ((data[0] - data[1]) / data[1]) * 100;
  const trend = Math.abs(trendValue).toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const message = (trendValue > 0 ? `\uD83D\uDCC8` : `\uD83D\uDCC9`) + ` ${trend}% vs previous period`;
  return {
    currentValue: data[0],
    trendValue: trendValue,
    message: message,
  };
};
