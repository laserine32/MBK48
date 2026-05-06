import { BtnAddPurchase, ViewDetailPurchase } from "@/components/shared/form/purchase-form";
import PageTitle from "@/components/shared/page/page-title";
import Pagination from "@/components/shared/page/pagination";
import Table from "@/components/shared/page/table";
import { TableSkeleton } from "@/components/shared/skeletons";
import { SearchParams } from "@/lib/customTypes";
import { formatCurrency, formatDateToLocal } from "@/lib/utils";
import { getPurchasePage, getPurchaseSearchPagin } from "@/server/purchase";
import { Metadata } from "next";
import { Suspense } from "react";

export const generateMetadata = (): Metadata => {
  return {
    title: "Purchase",
  };
};

const tableHeader: Array<string> = ["#", "DATE", "ITEMS", "TOTAL", "ACTIONS"];

const PurchasePage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams | undefined> | SearchParams | undefined;
}) => {
  const csp = await searchParams;
  const currentPage = Number(csp?.page) || 1;
  const data = await getPurchaseSearchPagin(currentPage);
  const totalPage = await getPurchasePage();
  const tr = data.map((item, index) => [
    { type: "data", value: index + 1 },
    { type: "data", value: formatDateToLocal(item.date) },
    { type: "data", value: item.items },
    { type: "data", value: formatCurrency(item.total) },
    {
      type: "action",
      value: item.id,
      buttons: [<ViewDetailPurchase key={`detail_${item.id}`} idPurchase={item.id} />],
    },
  ]);
  return (
    <>
      <PageTitle>{`PURCHASE`}</PageTitle>
      <div className="mb-5 flex items-center justify-between gap-1">
        <div className="flex-1 bg-input">&nbsp;</div>
        <BtnAddPurchase />
      </div>
      <Suspense key={currentPage} fallback={<TableSkeleton header={tableHeader} />}>
        <Table headers={tableHeader} data={tr}></Table>
      </Suspense>
      <div className="mt-4 flex justify-center">
        <Pagination totalPages={totalPage} />
      </div>
    </>
  );
};

export default PurchasePage;
