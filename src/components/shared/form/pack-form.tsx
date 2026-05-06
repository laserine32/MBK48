"use client";
import { useApp } from "@/components/toast-provider";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addPack, deletePack, editPack, PackType } from "@/server/pack";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { CircleNotchIcon, PencilIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";

interface FormProps {
  pack?: PackType;
  onSuccess?: () => void;
}

const formSchema = z.object({
  id: z.string().min(1, "Field is required!"),
  name: z.string().min(1, "Field is required!"),
  totalContent: z.number().min(1, "Field is required!"),
});

export const AddPackForm = () => {
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
            <DialogTitle>Add Pack</DialogTitle>
          </DialogHeader>
          <PackForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const EditPackForm = ({ pack }: { pack: PackType }) => {
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
            <DialogTitle>Edit Pack</DialogTitle>
          </DialogHeader>
          <PackForm pack={pack} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const DeletePackButton = ({ pack }: { pack: PackType }) => {
  const router = useRouter();
  const { setToast } = useApp();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deletePack(pack);
      setToast({
        type: "success",
        message: "Data added successfully.",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        message: "Failed to delete Pack.",
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
            <AlertDialogDescription>{`This will permanently delete this "${pack.name}" pack.`}</AlertDialogDescription>
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

export const PackForm: React.FC<FormProps> = ({ pack, onSuccess }) => {
  const router = useRouter();
  const { setToast } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: pack?.id || createId(),
      name: pack?.name || "",
      totalContent: pack?.totalContent || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (pack) {
        await editPack(values);
      } else {
        await addPack(values);
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
        message: "Failed to add Pack.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <FormProvider {...form}>
        <form id="form-pack" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Pack Name"
                    type="text"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="totalContent"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="field-totalContent">Total Content</FieldLabel>
                  <Input
                    {...field}
                    id="field-totalContent"
                    aria-invalid={fieldState.invalid}
                    placeholder="Total Content"
                    type="number"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-pack" disabled={isLoading}>
              {isLoading ? <CircleNotchIcon className="size-4 animate-spin" /> : `Save`}
            </Button>
          </Field>
        </form>
      </FormProvider>
    </>
  );
};
