import { fetchDashboardCardData } from "@/server/dashboard";
import { RatioPackCard, StatCard } from "./dashboard-card";

const StatCardsWrapper = async () => {
  const rawData = await fetchDashboardCardData();
  const { expenses, produced, packinuse, daysspent, monthExpenses, monthProduced, monthInuse, ratioPack } = rawData;
  return (
    <>
      <StatCard
        title="Expenses"
        value={expenses.total}
        CardIcon={"WalletIcon"}
        isCurrency={true}
        subvalue={expenses.day}
        theme="1"
      />
      <StatCard
        title="Month Expenses"
        value={monthExpenses.total}
        CardIcon={"MoneyIcon"}
        isCurrency={true}
        subvalue={monthExpenses.day}
        theme="6"
      />
      <StatCard
        title="Month Produced"
        value={monthProduced.total}
        CardIcon={"WarehouseIcon"}
        subvalue={monthProduced.day}
        theme="7"
      />
      <StatCard
        title="Month Pack In Use"
        value={monthInuse.total}
        CardIcon={"SmileyIcon"}
        subvalue={monthInuse.day}
        theme="8"
      />
      <StatCard
        title="Pack In Use"
        value={`${packinuse.total}`}
        CardIcon={"CardholderIcon"}
        subvalue={packinuse.day}
        theme="3"
      />
      <StatCard
        title="Pack Produced"
        value={produced.total}
        CardIcon={"FactoryIcon"}
        subvalue={produced.day}
        theme="2"
      />
      <StatCard
        title="Days Spent"
        value={daysspent.day}
        CardIcon={"CalendarIcon"}
        valueExt="Days"
        subvalue={daysspent.spell}
        theme="4"
      />
      <RatioPackCard data={ratioPack} />
    </>
  );
};

export default StatCardsWrapper;
