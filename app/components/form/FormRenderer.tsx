"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { EventFieldSchema } from "@/app/forms/event/eventFormDefinition";
import type {
  EventFormData,
  EventFormInput,
} from "@/app/forms/event/eventForm.schema";
import { eventFormSchema } from "@/app/forms/event/eventForm.schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { FormRendererField } from "./FormRendererField";

type Props = {
  fields: readonly EventFieldSchema[];
  defaultValues: EventFormInput;
  onSubmit: SubmitHandler<EventFormData>;
  submitButtonLabel?: string | undefined;
  submittingButtonLabel?: string | undefined;
};

export function FormRenderer({
  fields,
  defaultValues,
  onSubmit,
  submitButtonLabel = "Submit",
  submittingButtonLabel = "Submitting...",
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormInput, undefined, EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={cn(field.columnSpan === 2 && "md:col-span-2")}
          >
            <FormRendererField
              field={field}
              register={register}
              control={control}
              errors={errors}
            />
          </div>
        ))}
      </div>

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? submittingButtonLabel : submitButtonLabel}
      </Button>
    </form>
  );
}
