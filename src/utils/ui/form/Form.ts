import { ReactNode } from "react";
import { DeepPartial, DeepRecord } from "@/utils/utils";

export type FormProps<Data> = {
  data: DeepPartial<Data>;
  disabled?: DeepPartial<DeepRecord<Data, boolean>>;
  errors?: DeepPartial<DeepRecord<Data, boolean>>;
  helpers?: DeepPartial<DeepRecord<Data, ReactNode>>;
  onChange?: (changes: DeepPartial<Data>) => void;
}

export type Form<Data> = React.ComponentType<FormProps<Data>>;
