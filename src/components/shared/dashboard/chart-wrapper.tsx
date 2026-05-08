import { getYearPassed } from "@/lib/utils";
import { getMainChart } from "@/server/dashboard";
import DashboardChart from "./dashboard-chart";

const ChartWrapper = async () => {
  const yearPassed = getYearPassed();
  const data = await getMainChart();
  return (
    <>
      <DashboardChart data={data} years={yearPassed} />{" "}
    </>
  );
};

export default ChartWrapper;
