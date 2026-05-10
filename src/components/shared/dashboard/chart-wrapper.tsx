import DashboardBarChart from "./dashboard-bar-chart";
import DashboardScoreChart from "./dashboard-score-chart";
// import DashboardInsight from "./dashboard-insight";
import { getScore } from "@/server/dashboard";
import { Suspense } from "react";

const ChartWrapper = async () => {
  const dataScore = await getScore();
  return (
    <>
      <div className="flex flex-col-reverse gap-2 md:flex-col md:gap-4">
        <Suspense key={dataScore.toString()} fallback={null}>
          <DashboardScoreChart data={dataScore} />
          {/* <DashboardInsight /> */}
        </Suspense>
      </div>
      <div>
        <DashboardBarChart />
      </div>
    </>
  );
};

export default ChartWrapper;
