import { TrType } from "@/lib/customTypes";
import PageTitle from "./page-title";
import { Suspense } from "react";
import Search from "./search";
import { TableSkeleton } from "../skeletons";
import Table from "./table";
import Pagination from "./pagination";

type processPageType = {
  pageTitle: string;
  suspenseKey: string;
  tableHeader: Array<string>;
  tr: TrType[];
  totalPages: number;
};

const ProcessPage: React.FC<processPageType> = ({ pageTitle, suspenseKey, tableHeader, tr, totalPages }) => {
  return (
    <>
      <PageTitle>{pageTitle.toUpperCase()}</PageTitle>
      <div className="mb-5 flex items-center justify-between gap-1">
        <Suspense key={suspenseKey} fallback={null}>
          <Search />
        </Suspense>
      </div>
      <Suspense key={suspenseKey} fallback={<TableSkeleton header={tableHeader} />}>
        <Table headers={tableHeader} data={tr}></Table>
      </Suspense>
      <div className="mt-4 flex justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
};

export default ProcessPage;
