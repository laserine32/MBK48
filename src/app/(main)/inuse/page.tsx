import InuseFormPage from "@/components/shared/form/inuse-form";
import ProcessPage from "@/components/shared/page/process-page";
import { SearchParams } from "@/lib/customTypes";
import { formatTimeToLocal } from "@/lib/utils";
import { getInUsedPage, getInUsedSearchPagin, getPackInUse } from "@/server/inuse";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Pack In Used",
  };
};

const tableHeader: Array<string> = ["#", "NAME", "TIME START", "TIME END"];

const InusePage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams | undefined> | SearchParams | undefined;
}) => {
  const csp = await searchParams;
  const query = csp?.query || "";
  const currentPage = Number(csp?.page) || 1;
  const data = await getInUsedSearchPagin(query, currentPage);
  const totalPage = await getInUsedPage(query);
  const tr = data.map((item, index) => [
    { type: "data", value: index + 1 },
    { type: "data", value: item.name },
    { type: "data", value: formatTimeToLocal(item.timeStart) },
    { type: "data", value: item.flag ? `[IN USE]` : formatTimeToLocal(item.timeEnd) },
  ]);
  const datacb = await getPackInUse();
  return (
    <>
      <InuseFormPage datacb={datacb} />
      <ProcessPage
        pageTitle={"Packs In Used"}
        suspenseKey={query + currentPage}
        tableHeader={tableHeader}
        tr={tr}
        totalPages={totalPage}
      ></ProcessPage>
    </>
  );
};

export default InusePage;
