"use client";

import type { Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

import type { EventFieldSchema } from "@/app/forms/event/eventFormDefinition";
import type { EventFormInput } from "@/app/forms/event/eventForm.schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFieldError } from "@/lib/form-errors";

import { FormField } from "./FormField";

type Props = {
  field: EventFieldSchema;
};

export function FormRendererField({ field }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<EventFormInput>();

  const fieldName = field.name as Path<EventFormInput>;
  const error = getFieldError(errors, fieldName);

  if (field.component === "TEXT_FIELD") {
    return (
      <FormField label={field.label} isRequired={field.isRequired} error={error}>
        <Input
          type={field.inputType ?? "text"}
          placeholder={field.placeholder}
          aria-invalid={Boolean(error)}
          {...register(fieldName)}
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
          {...register(fieldName)}
        />
      </FormField>
    );
  }

  return (
    <FormField label={field.label} isRequired={field.isRequired} error={error}>
      <Controller
        control={control}
        name={fieldName}
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
