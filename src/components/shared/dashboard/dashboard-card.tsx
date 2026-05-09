"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ChartPieSliceIcon,
  CalendarIcon,
  CardholderIcon,
  FactoryIcon,
  MoneyIcon,
  SmileyIcon,
  WalletIcon,
  WarehouseIcon,
  TrendDownIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";
import { FC, useEffect, useState } from "react";

type dataRatioType = {
  inuse: number;
  prod: number;
  percent: number;
};

export const RatioPackCard = ({ data }: { data: dataRatioType }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(data.percent), 500);
    return () => clearTimeout(timer);
  }, [data.percent]);

  return (
    <>
      <Card className="gap-1 py-2 md:py-4">
        <CardContent className="flex items-start gap-1 space-y-0 space-x-1 md:gap-2 md:space-x-3">
          <div className="hidden rounded-xl bg-bg-5 p-1.5 md:block">
            <ChartPieSliceIcon className="h-8 w-8 text-fg-5" />
          </div>
          <div className="grow">
            <h3 className="text-xs font-medium md:text-sm">{`Pack Ratio`}</h3>
            <Field className="w-full max-w-sm pt-2">
              <Progress
                value={progress}
                id="progress-upload"
                className="mb-1.5 h-2 md:h-6 md:*:data-[slot=progress-indicator]:bg-fg-5"
              />
              <FieldLabel className="text-muted-foreground">
                <span className="text-xxs md:text-xs">Ratio</span>
                <span className="ml-auto text-xxs md:text-xs">{`${data.inuse}/${data.prod}`}</span>
              </FieldLabel>
            </Field>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

type StatCardType = {
  title: string;
  value: string | number;
  CardIcon: keyof typeof dataIcon;
  theme: string;
  isCurrency?: boolean;
  valueExt?: string;
  subvalue?: Array<string> | string;
};

const dataIcon = {
  CalendarIcon: CalendarIcon,
  CardholderIcon: CardholderIcon,
  FactoryIcon: FactoryIcon,
  MoneyIcon: MoneyIcon,
  SmileyIcon: SmileyIcon,
  WalletIcon: WalletIcon,
  WarehouseIcon: WarehouseIcon,
};

export const StatCard: FC<StatCardType> = ({
  title,
  value,
  CardIcon,
  theme,
  isCurrency = false,
  valueExt = null,
  subvalue = null,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const IconCard = dataIcon[CardIcon];
  const bgIcon = `bg-bg-${theme}`;
  const fgIcon = `text-fg-${theme}`;
  useEffect(() => {
    // kalau string -> tidak animasi
    if (typeof value !== "number") return;
    const duration = 1000;
    const startTime = performance.now();
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
    let frameId: number;
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const currentValue = Math.floor(easedProgress * value);
      setDisplayValue(currentValue);
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  const formatNumber = (num: number) => {
    const formatted = num.toLocaleString("id-ID");
    return isCurrency ? formatCurrency(num) : formatted;
  };

  const renderValue = () => {
    if (typeof value === "string") {
      return value;
    }
    return formatNumber(displayValue);
  };
  return (
    <>
      <Card className="gap-1 py-2 md:py-4">
        <CardContent className="flex items-start gap-1 space-y-0 space-x-1 md:gap-2 md:space-x-3">
          <div className={cn("hidden rounded-xl p-1.5 md:block", bgIcon)}>
            <IconCard className={cn("h-8 w-8", fgIcon)} />
          </div>
          <div className="grow">
            <h3 className="text-xs font-medium md:text-sm">{title}</h3>
            <p className="truncate rounded-xl py-0 text-sm md:py-2 md:text-2xl">
              {renderValue()} {valueExt}
            </p>
            <div className="text-muted-foreground">{subvalue && <SubValue value={subvalue} />}</div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const SubValue = ({ value }: { value: Array<string> | string }) => {
  return Array.isArray(value) ? (
    <>
      {value.map((e, i) => {
        if (e.slice(0, 6) != "xtrend") {
          return <PSubValue key={i}>{e}</PSubValue>;
        }
        const trendData = e.split("~");
        console.log(trendData);
        return (
          <div
            key={i}
            className={cn(
              "flex items-center gap-1",
              trendData[1] == "down" && "text-fg-2",
              trendData[1] == "up" && "text-fg-5"
            )}
          >
            {trendData[1] == "down" ? <TrendDownIcon /> : <TrendUpIcon />}
            <PSubValue>{trendData[2]}</PSubValue>
          </div>
        );
      })}
    </>
  ) : (
    <PSubValue>{value}</PSubValue>
  );
};

const PSubValue = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <p className="text-xxs text-inherit md:text-xs">{children}</p>;
};
