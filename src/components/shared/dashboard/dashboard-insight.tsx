import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LightbulbIcon, PlantIcon } from "@phosphor-icons/react/dist/ssr";

const DashboardInsight = () => {
  return (
    <>
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-sm bg-bg-3 p-1">
              <LightbulbIcon size={16} className="text-fg-3" />
            </div>
            <p>{`Insight`}</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
            <InsightCard />
            <InsightCard />
            <InsightCard />
            <InsightCard />
            <InsightCard />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const InsightCard = () => {
  return (
    <>
      <Card className="py-0">
        <CardContent className="flex items-start gap-2 p-2 sm:p-4 md:gap-4">
          <div className="rounded-sm bg-bg-1 p-1">
            <PlantIcon className={cn("size-4 md:size-8", "text-fg-1")} />
          </div>
          <div className="flex flex-col">
            <h3 className={cn("text-xs font-medium md:text-sm", "text-fg-1")}>{`High Consumtion Alert`}</h3>
            <p className="text-xxs text-muted-foreground md:text-xs">{`You consumed 25 pack in Jan 2026, that's 56% more than Dec 2025`}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardInsight;
