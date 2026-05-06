"use client";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { PurchaseProvider, usePurchase } from "@/components/purchase-provider";
import { formatCurrency, formatDateToLocal } from "@/lib/utils";
import {
  addPurchase,
  DetailPurchaseType,
  getDetailPurchase,
  ItemsPurchaseType,
  PurchaseDetailType,
} from "@/server/purchase";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotchIcon, EyeIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import z from "zod";
import { useApp } from "@/components/toast-provider";
import { useRouter } from "next/navigation";

export const BtnAddPurchase = () => {
  return (
    <>
      <Button size="icon" variant="default" asChild>
        <Link href={`/purchase/add`}>
          <PlusIcon className="size-4 text-white" />
        </Link>
      </Button>
    </>
  );
};

export const AddPurchaseForm = ({ dataItems }: { dataItems: ItemsPurchaseType }) => {
  return (
    <>
      <PurchaseProvider>
        <ActionForm dataItems={dataItems} />
        <div className="my-4 border"></div>
        <TableDetailPurchase />
      </PurchaseProvider>
    </>
  );
};

const formSchema = z.object({
  itemId: z.string().min(1, "Field is required!"),
  price: z.number().min(1, "Field is required!"),
  qty: z.number().min(1, "Field is required!"),
});

const ActionForm = ({ dataItems }: { dataItems: ItemsPurchaseType }) => {
  const { addItem } = usePurchase();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemId: "",
      price: 0,
      qty: 1,
    },
  });
  // const selectedItemId = form.watch("itemId");
  const selectedItemId = useWatch({
    control: form.control,
    name: "itemId",
  });

  useEffect(() => {
    const selected = dataItems.find((i) => i.value === selectedItemId);

    if (selected) {
      form.setValue("price", selected.price);
    }
  }, [selectedItemId, dataItems, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const itemName = dataItems.find((i) => i.value === values.itemId)?.label || "";
      const toPush = {
        ...values,
        item: itemName,
        total: values.price * values.qty,
      };
      addItem(toPush);
      // console.log(values);
      // await addPurchase(values);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <FormProvider {...form}>
        <form id="form-action" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="itemId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Pack</FieldLabel>
                  <Combobox items={dataItems} value={field.value} onValueChange={field.onChange}>
                    <ComboboxTrigger
                      render={
                        <Button variant="outline" className="w-64 justify-between font-normal">
                          <ComboboxValue />
                        </Button>
                      }
                    />
                    <ComboboxContent>
                      <ComboboxInput
                        placeholder="Select items..."
                        showTrigger={false}
                        id="field-packid"
                        onChange={(e) => field.onChange(e.target.value)}
                        aria-invalid={fieldState.invalid}
                      />
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {dataItems.map((item) => (
                          <ComboboxItem key={item.value} value={item.value}>
                            {item.label}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="field-price">Price</FieldLabel>
                  <InputGroup className="w-full">
                    <InputGroupAddon>
                      <InputGroupText>Rp.</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="field-price"
                      aria-invalid={fieldState.invalid}
                      placeholder="Item Price"
                      type="number"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="qty"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="field-qty">Qty</FieldLabel>
                  <Input
                    {...field}
                    id="field-qty"
                    aria-invalid={fieldState.invalid}
                    placeholder="Qty"
                    type="number"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <Field orientation="horizontal" className="justify-end">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-action" disabled={isLoading}>
              {isLoading ? <CircleNotchIcon className="size-4 animate-spin" /> : `Add`}
            </Button>
          </Field>
        </form>
      </FormProvider>
    </>
  );
};

export const TableDetailPurchase = () => {
  const router = useRouter();
  const { setToast } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const { items, removeItem } = usePurchase();
  const grandTotal = items.reduce((acc, i) => acc + i.total, 0);

  async function savePurchase() {
    setIsLoading(true);
    try {
      if (items.length == 0) {
        setToast({
          type: "error",
          message: "Cannot process empty purchase.",
        });
        return;
      }
      await addPurchase(items, grandTotal);
      setIsLoading(false);
      setToast({
        type: "success",
        message: "Data added successfully.",
      });
      router.push("/purchase");
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        message: "Failed to add Purchase.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <table className="w-full text-left text-sm">
        <thead className="text-sm uppercase">
          <tr>
            <th className="p-2 text-center md:px-6 md:py-3">#</th>
            <th className="p-2 md:px-6 md:py-3">ITEMS</th>
            <th className="p-2 text-center md:px-6 md:py-3">QTY</th>
            <th className="p-2 text-center md:px-6 md:py-3">PRICE</th>
            <th className="p-2 text-center md:px-6 md:py-3">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.itemId}>
              <td className="p-2 text-center md:px-6 md:py-3">
                <Button size="icon" variant="destructive" onClick={() => removeItem(item.itemId)}>
                  <TrashIcon className="size-4" />
                </Button>
              </td>
              <td className="p-2 md:px-6 md:py-3">{item.item}</td>
              <td className="p-2 text-center md:px-6 md:py-3">{item.qty}</td>
              <TdCurrency value={formatCurrency(item.price)} />
              <TdCurrency value={formatCurrency(item.total)} />
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={4} className="p-2 text-center md:px-6 md:py-3">
              TOTAL
            </th>
            <TdCurrency value={formatCurrency(grandTotal)} />
          </tr>
        </tfoot>
      </table>

      <Field orientation="horizontal" className="mt-4 justify-end">
        <Button disabled={isLoading} onClick={() => savePurchase()}>
          {isLoading ? <CircleNotchIcon className="size-4 animate-spin" /> : `Save`}
        </Button>
      </Field>
    </>
  );
};

export const ViewDetailPurchase = ({ idPurchase }: { idPurchase: string }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<DetailPurchaseType | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getDetailPurchase(idPurchase);
      setData(res);
    };
    if (open) {
      fetchData();
    }
  }, [idPurchase, open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="default">
            <EyeIcon className="size-4 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-1/2!" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Detail Purchase</DialogTitle>
          </DialogHeader>
          <TableTransaction data={data} />
        </DialogContent>
      </Dialog>
    </>
  );
};

type TableTransactionType = {
  data: DetailPurchaseType | null;
  action?: boolean;
};

const TableTransaction: FC<TableTransactionType> = ({ data, action = false }) => {
  const headers = ["#", "ITEMS", "QTY", "PRICE", "TOTAL"];
  if (!data) return;
  return (
    <>
      {!action && (
        <div className="flex items-center justify-start gap-1 text-xl">
          <h3>Date :</h3>
          <p>{formatDateToLocal(data?.date ?? `2026-02-01`)}</p>
        </div>
      )}
      <table className="w-full text-left text-sm">
        <thead className="text-sm uppercase">
          <tr>
            {headers.map((item, index) => {
              return (
                <th className="p-2 md:px-6 md:py-3" key={index}>
                  {item}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <TableRow tr={data?.detail ?? null} />
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={headers.length - (action ? 2 : 1)} className="p-2 md:px-6 md:py-3">
              TOTAL
            </th>
            <TdCurrency value={formatCurrency(data?.total ?? 0)} />
          </tr>
        </tfoot>
      </table>
    </>
  );
};

const TableRow = ({ tr }: { tr: PurchaseDetailType[] | null }) => {
  return tr?.map((trtd, i) => (
    <tr key={i} className="border-b">
      <td className="p-2 md:px-6 md:py-3">{i + 1}</td>
      <td className="p-2 md:px-6 md:py-3">{trtd.name}</td>
      <td className="p-2 text-center md:px-6 md:py-3">{trtd.qty}</td>
      <TdCurrency value={formatCurrency(trtd.price)} />
      <TdCurrency value={formatCurrency(trtd.total)} />
      {/* {trtd?.map((td, j) => (
				<TableData key={j} td={td} />
			))} */}
    </tr>
  ));
};

const TdCurrency = ({ value }: { value: string }) => {
  const splv = value.split("Rp").map((e) => {
    if (e == "") return "Rp";
    return e;
  });
  return (
    <td className="p-2 md:px-6 md:py-3">
      <div className="flex items-center justify-between">
        {splv.map((e, i) => (
          <p key={i}>{e}</p>
        ))}
      </div>
    </td>
  );
};
