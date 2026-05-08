import { fetchDashboardCardData } from "@/server/dashboard";
import {
  CalendarIcon,
  CardholderIcon,
  FactoryIcon,
  MoneyIcon,
  SmileyIcon,
  WalletIcon,
  WarehouseIcon,
} from "@phosphor-icons/react/dist/ssr";
import { RatioPackCard, StatCard } from "./dashboard-card";

const StatCardsWrapper = async () => {
  const { expenses, produced, packinuse, daysspent, monthExpenses, monthProduced, monthInuse, ratioPack } =
    await fetchDashboardCardData();
  return (
    <>
      <StatCard
        title="Expenses"
        value={expenses.total}
        type={<WalletIcon className="h-5 w-5" />}
        isCurrency={true}
        subvalue={expenses.day}
      />
      <StatCard
        title="Produced"
        value={produced.total}
        type={<FactoryIcon className="h-5 w-5" />}
        subvalue={produced.day}
      />
      <StatCard
        title="Pack In Use"
        value={`${packinuse.total}`}
        type={<CardholderIcon className="h-5 w-5" />}
        subvalue={packinuse.day}
      />
      <StatCard
        title="Days Spent"
        value={daysspent.day}
        type={<CalendarIcon className="h-5 w-5" />}
        valueExt="Days"
        subvalue={daysspent.spell}
      />

      <StatCard
        title="Month Expenses"
        value={monthExpenses.total}
        type={<MoneyIcon className="h-5 w-5" />}
        isCurrency={true}
        subvalue={monthExpenses.day}
      />
      <StatCard
        title="Month Produced"
        value={monthProduced.total}
        type={<WarehouseIcon className="h-5 w-5" />}
        subvalue={monthProduced.day}
      />
      <StatCard
        title="Month Pack In Use"
        value={monthInuse.total}
        type={<SmileyIcon className="h-5 w-5" />}
        subvalue={monthInuse.day}
      />
      <RatioPackCard data={ratioPack} />
    </>
  );
};

export default StatCardsWrapper;
