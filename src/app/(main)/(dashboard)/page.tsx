import ChartWrapper from "@/components/shared/dashboard/chart-wrapper";
import StatCardsWrapper from "@/components/shared/dashboard/stat-cards-wrapper";
import { CardsSkeleton, ChartGroupSkeleton } from "@/components/shared/skeletons";
import { Suspense } from "react";

const Home = async () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
        <Suspense fallback={<CardsSkeleton />}>
          <StatCardsWrapper />
        </Suspense>
      </div>
      <div className="my-6 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
        <Suspense fallback={<ChartGroupSkeleton />}>
          <ChartWrapper />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
