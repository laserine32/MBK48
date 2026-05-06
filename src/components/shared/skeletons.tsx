import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const CardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row space-y-0 space-x-3 pb-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

export const CardsSkeleton = () => {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
};

export const TableItemsSkeleton = () => {
  const data: Array<number> = [...Array(5).keys()];
  return (
    <table className="w-full text-left text-sm text-gray-500">
      <thead className="bg-gray-50 text-sm text-gray-700 uppercase">
        <tr>
          <th className="px-6 py-3">#</th>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Unit</th>
          <th className="px-6 py-3">Price</th>
          <th className="px-6 py-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="border-b bg-white">
            <td className="px-6 py-3">
              <Skeleton className="h-6 w-16" />
            </td>
            <td className="px-6 py-3">
              <Skeleton className="h-6 w-16" />
            </td>
            <td className="px-6 py-3">
              <Skeleton className="h-6 w-16" />
            </td>
            <td className="px-6 py-3">
              <Skeleton className="h-6 w-16" />
            </td>
            <td className="flex justify-center gap-1 py-3">
              <Skeleton className="h-6 w-16" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const TableSkeleton = ({ header }: { header: Array<string> }) => {
  const data: Array<number> = [...Array(5).keys()];
  return (
    <table className="w-full text-left text-sm text-gray-500">
      <thead className="bg-gray-50 text-sm text-gray-700 uppercase">
        <tr>
          {header.map((item, index) => {
            if (item.toLowerCase() == "actions")
              return (
                <th key={index} className="px-6 py-3 text-center">
                  Actions
                </th>
              );
            return (
              <th key={index} className="px-6 py-3">
                {item}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="border-b bg-white">
            {header.map((item, index) => (
              <td key={index} className="px-6 py-3">
                <Skeleton className="h-6 w-16" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const TransactionDetailSkelecton = ({ header }: { header: Array<string> }) => {
  const data: Array<number> = [...Array(5).keys()];
  return (
    <>
      <div className="mb-5 flex items-center justify-start gap-1">
        <h3>Date :</h3>
        <Skeleton className="h-5 w-40" />
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-sm uppercase">
          <tr>
            {header.map((item, index) => {
              return (
                <th className="p-2 md:px-6 md:py-3" key={index}>
                  {item}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b bg-white">
              {header.map((item, index) => (
                <td key={index} className="p-2 md:px-6 md:py-3">
                  <Skeleton className={cn("h-6", item === "#" ? "w-6" : "w-16")} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={header.length - 1} className="p-2 md:px-6 md:py-3">
              TOTAL
            </th>
            <td className="p-2 md:px-6 md:py-3">
              <Skeleton className="h-6 w-16" />
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};
