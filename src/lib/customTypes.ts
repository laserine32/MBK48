import { JSX } from "react";

export type SearchParams = {
  query?: string;
  page?: string;
};

export type TrType = Array<TdType>;

export type TdType = {
  type: string;
  value: string | number | null;
  buttons?: Array<JSX.Element>;
};
