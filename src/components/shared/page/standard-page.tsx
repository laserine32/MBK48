import { TrType } from "@/lib/customTypes";
import PageTitle from "./page-title";
import Search from "./search";
import Pagination from "./pagination";
import { JSX, Suspense } from "react";
import { TableSkeleton } from "../skeletons";
import Table from "./table";

type standardPageType = {
  pageTitle: string;
  suspenseKey: string;
  tableHeader: Array<string>;
  tr: TrType[];
  totalPages: number;
  addButton: JSX.Element;
};

const StandardPage: React.FC<standardPageType> = ({
  pageTitle,
  suspenseKey,
  tableHeader,
  tr,
  totalPages,
  addButton,
}) => {
  return (
    <>
      <PageTitle>{pageTitle.toUpperCase()}</PageTitle>
      <div className="mb-5 flex items-center justify-between gap-1">
        <Suspense key={suspenseKey} fallback={null}>
          <Search />
        </Suspense>
        {addButton}
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

export default StandardPage;
