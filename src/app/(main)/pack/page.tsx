import { AddPackForm, DeletePackButton, EditPackForm } from "@/components/shared/form/pack-form";
import StandardPage from "@/components/shared/page/standard-page";
import { SearchParams } from "@/lib/customTypes";
import { getPacksPage, getPacksSearchPagin } from "@/server/pack";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Pack",
  };
};

const tableHeader: Array<string> = ["#", "NAME", "CONTENT", "ACTIONS"];

const ItemPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams | undefined> | SearchParams | undefined;
}) => {
  const csp = await searchParams;
  const query = csp?.query || "";
  const currentPage = Number(csp?.page) || 1;
  const data = await getPacksSearchPagin(query, currentPage);
  const totalPage = await getPacksPage(query);
  const tr = data.map((item, index) => [
    { type: "data", value: index + 1 },
    { type: "data", value: item.name },
    { type: "data", value: item.totalContent },
    {
      type: "action",
      value: item.id,
      buttons: [
        <EditPackForm key={`edit-${index}`} pack={item} />,
        <DeletePackButton key={`delete-${index}`} pack={item} />,
      ],
    },
  ]);
  const addButton = <AddPackForm />;
  return (
    <>
      <StandardPage
        pageTitle={"Packs"}
        suspenseKey={query + currentPage}
        tableHeader={tableHeader}
        tr={tr}
        totalPages={totalPage}
        addButton={addButton}
      ></StandardPage>
    </>
  );
};

export default ItemPage;
