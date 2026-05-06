import { AddItemForm, DeleteItemButton, EditItemForm } from "@/components/shared/form/item-form";
import StandardPage from "@/components/shared/page/standard-page";
import { getItemPage, getItemsSearchPagin } from "@/server/items";
import { SearchParams } from "@/lib/customTypes";
import { formatCurrency } from "@/lib/utils";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Items",
  };
};

const tableHeader: Array<string> = ["#", "NAME", "UNIT", "PRICE", "ACTIONS"];

const ItemPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams | undefined> | SearchParams | undefined;
}) => {
  const csp = await searchParams;
  const query = csp?.query || "";
  const currentPage = Number(csp?.page) || 1;
  const data = await getItemsSearchPagin(query, currentPage);
  const totalPage = await getItemPage(query);
  const tr = data.map((item, index) => [
    { type: "data", value: index + 1 },
    { type: "data", value: item.name },
    { type: "data", value: item.unit },
    { type: "data", value: formatCurrency(item.price) },
    {
      type: "action",
      value: item.id,
      buttons: [
        <EditItemForm key={`edit-${index}`} items={item} />,
        <DeleteItemButton key={`delete-${index}`} items={item} />,
      ],
    },
  ]);
  const addButton = <AddItemForm />;
  return (
    <>
      <StandardPage
        pageTitle={"Items"}
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
