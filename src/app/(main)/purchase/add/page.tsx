import { AddPurchaseForm } from "@/components/shared/form/purchase-form";
import PageTitle from "@/components/shared/page/page-title";
import { getItemsPurchase } from "@/server/purchase";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Add Purchase",
  };
};

const AddPurchasePage = async () => {
  const data = await getItemsPurchase();
  const dataItems = [
    {
      label: "Select items...",
      value: "",
      price: 0,
    },
    ...data,
  ];
  return (
    <>
      <PageTitle>{`ADD PURCHASE`}</PageTitle>
      <AddPurchaseForm dataItems={dataItems} />
    </>
  );
};

export default AddPurchasePage;
