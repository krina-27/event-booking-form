"use client";

import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import type { EventFieldSchema } from "@/app/forms/event/eventFormDefinition";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormField } from "./FormField";

type Props<TFormValues extends FieldValues> = {
  field: EventFieldSchema;
  register: UseFormRegister<TFormValues>;
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
};

export function FormRendererField<TFormValues extends FieldValues>({
  field,
  register,
  control,
  errors,
}: Props<TFormValues>) {
  const error = errors[field.name as Path<TFormValues>]?.message as
    | string
    | undefined;

  if (field.component === "TEXT_FIELD") {
    return (
      <FormField label={field.label} isRequired={field.isRequired} error={error}>
        <Input
          type={field.inputType ?? "text"}
          placeholder={field.placeholder}
          aria-invalid={Boolean(error)}
          {...register(field.name as Path<TFormValues>)}
        />
      </FormField>
    );
  }

  if (field.component === "DATE_FIELD") {
    return (
      <FormField label={field.label} isRequired={field.isRequired} error={error}>
        <Input
          type="date"
          aria-invalid={Boolean(error)}
          {...register(field.name as Path<TFormValues>)}
        />
      </FormField>
    );
  }

  return (
    <FormField label={field.label} isRequired={field.isRequired} error={error}>
      <Controller
        control={control}
        name={field.name as Path<TFormValues>}
        render={({ field: controllerField }) => (
          <Select
            value={(controllerField.value as string | undefined) ?? ""}
            onValueChange={controllerField.onChange}
            name={controllerField.name}
          >
            <SelectTrigger className="w-full" aria-invalid={Boolean(error)}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>

            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  );
}
