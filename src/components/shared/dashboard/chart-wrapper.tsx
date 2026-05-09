import DashboardBarChart from "./dashboard-bar-chart";
import DashboardScoreChart from "./dashboard-score-chart";
import DashboardInsight from "./dashboard-insight";

const ChartWrapper = async () => {
  return (
    <>
      <div className="flex flex-col-reverse gap-2 md:flex-col md:gap-4">
        <DashboardScoreChart />
        <DashboardInsight />
      </div>
      <DashboardBarChart />
    </>
  );
};

export default ChartWrapper;
