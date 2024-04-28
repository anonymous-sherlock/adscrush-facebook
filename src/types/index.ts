import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { type FileWithPath } from "react-dropzone";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData> extends DataTableSearchableColumn<TData> {
  options: Option[];
}

export interface AdminUsersListParams extends Params {
  userId: string;
}
export interface BonusSearchParams extends SearchParams {
  date?: string;
}
export interface PaymentSearchParams extends SearchParams {
  date?: string;
}
