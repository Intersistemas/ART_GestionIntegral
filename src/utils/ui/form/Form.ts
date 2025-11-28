import { ReactNode } from "react";

export type FormProps<Data, Fields extends keyof any = keyof Data> = {
  data: Partial<Data>;
  disabled?: Partial<Record<Fields, boolean>>;
  errors?: Partial<Record<Fields, boolean>>;
  helpers?: Partial<Record<Fields, ReactNode>>;
  onChange?: (changes: Partial<Data>) => void;
}
export type Form<Data, Fields extends keyof any = keyof Data> = React.ComponentType<FormProps<Data, Fields>>;
