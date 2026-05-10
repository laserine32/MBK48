export const formatedDate = (tgl: Date) => {
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

export const calcTrend = (data: Array<number>) => {
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
  const message = `xtrend~` + (trendValue > 0 ? `up` : `down`) + `~${trend}% vs previous period`;
  return {
    currentValue: data[0],
    trendValue: trendValue,
    message: message,
  };
};

export const getDaysSpent = () => {
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
      // if (paramKey === "d") return "A Day";
      if (paramKey === "d") return "";
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

export const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export const getDashboardItemScore = (avg: number | unknown, sum: number | unknown, normal: boolean = false) => {
  if (typeof avg !== "number" || typeof sum !== "number") return 0;
  const a = ((sum - avg) / avg) * 100;
  const b = (normal ? 100 : 70) - a;
  // console.log(a, b);
  return clamp(b);
};

export type rankMsgType = {
  excellent: string;
  good: string;
  warning: string;
  danger: string;
};

export const getRankMessage = (score: number, msg: rankMsgType) => {
  let rank: string = "unbelivable";
  let message = "Unbelivable!";
  if (score <= 40) {
    rank = "danger";
    message = msg.danger;
  } else if (score <= 60) {
    rank = "warning";
    message = msg.warning;
  } else if (score <= 90) {
    rank = "good";
    message = msg.good;
  } else {
    rank = "excellent";
    message = msg.excellent;
  }
  return { rank: rank, message: message };
};

export const standardDeviationScore = (arr: number[]) => {
  const avg = (arr: number[]) => (arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length);
  if (arr.length <= 1) return 0;
  const mean = avg(arr);
  console.log(`MEAN : `, mean);
  const variance =
    arr.reduce((sum, value) => {
      // return sum + Math.pow(value - mean, 2);
      return sum + (value - mean) ** 2;
    }, 0) /
    (arr.length - 1);
  const sd = Math.sqrt(variance);
  // const rawscore = (sd / mean) * 100;
  // console.log(`SD = `, sd, ` RAW SCORE = `, rawscore);
  // return 100 - Math.min(Math.ceil(rawscore), 100);
  return sd;
};
