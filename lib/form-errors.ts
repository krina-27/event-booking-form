import type { FieldErrors, FieldValues, Path } from "react-hook-form";
import { get } from "react-hook-form";

export const getFieldError = <TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  name: Path<TFieldValues>,
): string | undefined => {
  const message = get(errors, name)?.message;

  return typeof message === "string" ? message : undefined;
};
