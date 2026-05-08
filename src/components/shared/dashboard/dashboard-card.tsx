"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { ChartPieSliceIcon } from "@phosphor-icons/react";
import { FC, JSX, useEffect, useState } from "react";

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
      <Card className="gap-2">
        <CardHeader className="flex flex-row space-y-0 space-x-3">
          <ChartPieSliceIcon className="h-5 w-5" />
          <h3 className="ml-2 text-sm font-medium">{`Pack Ratio`}</h3>
        </CardHeader>
        <CardContent>
          <Field className="w-full max-w-sm pt-2">
            <Progress value={progress} id="progress-upload" className="mb-1.5 h-6" />
            <FieldLabel htmlFor="progress-upload" className="text-xs text-muted-foreground">
              <span>Ratio</span>
              <span className="ml-auto">{`${data.inuse}/${data.prod}`}</span>
            </FieldLabel>
          </Field>
        </CardContent>
      </Card>
    </>
  );
};

type StatCardType = {
  title: string;
  value: string | number;
  type: JSX.Element;
  isCurrency?: boolean;
  valueExt?: string;
  subvalue?: Array<string> | string;
};

export const StatCard: FC<StatCardType> = ({
  title,
  value,
  type,
  isCurrency = false,
  valueExt = null,
  subvalue = null,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
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
      <Card className="gap-2">
        <CardHeader className="flex flex-row space-y-0 space-x-3">
          {type}
          <h3 className="ml-2 text-sm font-medium">{title}</h3>
        </CardHeader>
        <CardContent className="space-y-0 space-x-3">
          <p className="truncate rounded-xl p-2 text-2xl">
            {renderValue()} {valueExt}
          </p>
          {subvalue && <SubValue value={subvalue} />}
        </CardContent>
      </Card>
    </>
  );
};

const SubValue = ({ value }: { value: Array<string> | string }) => {
  return Array.isArray(value) ? (
    <>
      {value.map((e, i) => (
        <p key={i} className="text-xs text-muted-foreground">
          {e}
        </p>
      ))}
    </>
  ) : (
    <p className="text-xs text-muted-foreground">{value}</p>
  );
};
