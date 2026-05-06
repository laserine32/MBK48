import { TdType, TrType } from "@/lib/customTypes";

const Table = ({ headers, data }: { headers: Array<string>; data: TrType[] }) => {
  return (
    <>
      <table className="w-full text-left text-sm">
        <thead className="text-sm uppercase">
          <tr>
            {headers.map((item, index) => {
              if (item.toLowerCase() == "actions")
                return (
                  <th className="p-2 text-center md:px-6 md:py-3" key={index}>
                    Actions
                  </th>
                );
              return (
                <th className="p-2 md:px-6 md:py-3" key={index}>
                  {item}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y">
          <TableRow tr={data} />
        </tbody>
      </table>
    </>
  );
};

const TableRow = ({ tr }: { tr: TrType[] }) => {
  return tr.map((trtd, i) => (
    <tr key={i} className="border-b">
      {trtd.map((td, j) => (
        <TableData key={j} td={td} />
      ))}
    </tr>
  ));
};

const TableData = ({ td }: { td: TdType }) => {
  if (td.type == "action") {
    return (
      <>
        <td className="flex justify-center gap-1 py-3">
          {td.buttons?.map((btn, i) => {
            return <span key={i}>{btn}</span>;
          })}
        </td>
      </>
    );
  }
  return <td className="p-2 md:px-6 md:py-3">{td.value}</td>;
};

export default Table;
