import type { DefaultValues, FieldValues, Path } from "react-hook-form";

type DefaultableField<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  defaultValue?: unknown;
};

export const getDefaultValues = <TFormValues extends FieldValues>(
  fields: readonly DefaultableField<TFormValues>[],
): DefaultValues<TFormValues> => {
  const defaultValues: Partial<TFormValues> = {};

  for (const field of fields) {
    defaultValues[field.name as keyof TFormValues] =
      field.defaultValue as TFormValues[typeof field.name];
  }

  return defaultValues as DefaultValues<TFormValues>;
};
