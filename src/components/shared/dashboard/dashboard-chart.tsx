import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { MainChartType } from "@/server/dashboard";

const DashboardChart = ({ data, years }: { data: MainChartType; years: number[] }) => {
  return (
    <>
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>{`Bar Chart - Interactive`}</CardTitle>
            <CardDescription>{`Showing Expenses, Produced & Pack In Use Chart`}</CardDescription>
          </div>
          <div>
            <Combobox items={years}>
              <ComboboxInput
                id="field-year"
                // value={field.value || ""}
                // onChange={(e) => field.onChange(e.target.value)}
                // aria-invalid={fieldState.invalid}
                placeholder="Select Year"
              />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {years.map((item) => (
                    <ComboboxItem
                      key={item}
                      value={item}
                      // onSelect={() => field.onChange(item)}
                    >
                      {item}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-3"></div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardChart;
