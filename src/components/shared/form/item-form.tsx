"use client";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleNotchIcon, PencilIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { addItem, deleteItem, editItem, ItemsType } from "@/server/items";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useApp } from "@/components/toast-provider";

interface FormProps {
  item?: ItemsType;
  onSuccess?: () => void;
}

const formSchema = z.object({
  id: z.string().min(1, "Field is required!"),
  name: z.string().min(1, "Field is required!"),
  unit: z.string().min(1, "Field is required!"),
  price: z.number().min(1, "Field is required!"),
});

const listUnits: Array<string> = ["Ons", "Pcs", "Pck", "Set"] as const;

export const AddItemForm = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogTrigger asChild>
          <Button size="icon" variant="default">
            <PlusIcon className="size-4 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-1/2!" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
          </DialogHeader>
          <ItemForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const EditItemForm = ({ items }: { items: ItemsType }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogTrigger asChild>
          <Button size="icon" variant="secondary">
            <PencilIcon className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-1/2!" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <ItemForm item={items} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const DeleteItemButton = ({ items }: { items: ItemsType }) => {
  const router = useRouter();
  const { setToast } = useApp();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(items);
      setToast({
        type: "success",
        message: "Data deleted successfully.",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        message: "Failed to delete Item.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <AlertDialog
        open={open}
        onOpenChange={(val) => {
          if (!isLoading) setOpen(val);
        }}
      >
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="destructive">
            <TrashIcon className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <TrashIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>{`This will permanently delete this "${items.name}" Item.`}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" asChild>
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? <CircleNotchIcon className="size-4 animate-spin" /> : `Delete`}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const ItemForm: React.FC<FormProps> = ({ item, onSuccess }) => {
  const router = useRouter();
  const { setToast } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: item?.id || createId(),
      name: item?.name || "",
      unit: item?.unit || "",
      price: item?.price || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (item) {
        console.log("Update");
        await editItem(values);
      } else {
        await addItem(values);
      }
      form.reset();
      setToast({
        type: "success",
        message: "Data added successfully.",
      });
      router.refresh();
      setIsLoading(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        message: "Failed to add Item.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <FormProvider {...form}>
        <form id="form-item" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input {...field} id="field-id" aria-invalid={fieldState.invalid} type="hidden" />
            )}
          />
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="field-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="field-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Item Name"
                    type="text"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="unit"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="field-unit">Unit</FieldLabel>
                  <Combobox items={listUnits} value={field.value} onValueChange={field.onChange}>
                    <ComboboxInput
                      id="field-unit"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      aria-invalid={fieldState.invalid}
                      placeholder="Select Unit"
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {listUnits.map((item) => (
                          <ComboboxItem key={item} value={item} onSelect={() => field.onChange(item)}>
                            {item}
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
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-item" disabled={isLoading}>
              {isLoading ? <CircleNotchIcon className="size-4 animate-spin" /> : `Save`}
            </Button>
          </Field>
        </form>
      </FormProvider>
    </>
  );
};
