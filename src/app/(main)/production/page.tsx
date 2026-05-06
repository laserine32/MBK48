import ProductionFormPage from "@/components/shared/form/production-form";
import ProcessPage from "@/components/shared/page/process-page";
import { SearchParams } from "@/lib/customTypes";
import { formatTimeToLocal } from "@/lib/utils";
import { getPackProduction, getProductionPage, getProductionSearchPagin } from "@/server/production";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Pack",
  };
};

const tableHeader: Array<string> = ["#", "NAME", "DATE"];

const ProductionPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams | undefined> | SearchParams | undefined;
}) => {
  const csp = await searchParams;
  const query = csp?.query || "";
  const currentPage = Number(csp?.page) || 1;
  const data = await getProductionSearchPagin(query, currentPage);
  const totalPage = await getProductionPage(query);
  const tr = data.map((item, index) => [
    { type: "data", value: index + 1 },
    { type: "data", value: item.name },
    { type: "data", value: formatTimeToLocal(item.date) },
  ]);
  const datacb = await getPackProduction();
  return (
    <>
      <ProductionFormPage datacb={datacb} />
      <ProcessPage
        pageTitle={"Production"}
        suspenseKey={query + currentPage}
        tableHeader={tableHeader}
        tr={tr}
        totalPages={totalPage}
      ></ProcessPage>
    </>
  );
};

export default ProductionPage;
