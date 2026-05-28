"use client";
import { addProduction, CBPackProductionType } from "@/server/production";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import PageTitle from "../page/page-title";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { Button } from "@/components/ui/button";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { useApp } from "@/components/toast-provider";

const formSchema = z.object({
  packId: z.string().min(1, "Field is required!"),
});

const ProductionFormPage = ({ datacb }: { datacb: CBPackProductionType }) => {
  const router = useRouter();
  const { setToast } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const defVal = datacb.find((e) => e.active === true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packId: defVal?.value || "",
    },
  });

  useEffect(() => {
    form.reset({
      packId: defVal?.value || "",
    });
    const setloading = () => {
      setIsLoading(false);
    };
    setloading();
  }, [defVal, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await addProduction(values);
      form.reset();
      setToast({
        type: "success",
        message: "Data added successfully.",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        message: "Failed to produce Pack.",
      });
    }
  }

  return (
    <>
      <PageTitle>{`ADD PRODUCTION`}</PageTitle>
      <FormProvider {...form}>
        <form id="form-inuse" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="packId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Pack</FieldLabel>
                  <Combobox items={datacb} value={field.value} onValueChange={field.onChange}>
                    <ComboboxTrigger
                      render={
                        <Button variant="outline" className="w-64 justify-between font-normal">
                          <ComboboxValue />
                        </Button>
                      }
                    />
                    <ComboboxContent>
                      <ComboboxInput
                        showTrigger={false}
                        id="field-packid"
                        onChange={(e) => field.onChange(e.target.value)}
                        aria-invalid={fieldState.invalid}
                      />
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {datacb.map((item) => (
                          <ComboboxItem key={item.value} value={item}>
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
            <Field orientation="horizontal" className="justify-end">
              <Button type="submit" form="form-inuse" disabled={isLoading}>
                {isLoading ? <CircleNotchIcon className="size-4 animate-spin" /> : `Save`}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </FormProvider>
      <div className="my-4 border"></div>
    </>
  );
};

export default ProductionFormPage;
