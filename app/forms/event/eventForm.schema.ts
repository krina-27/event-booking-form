import { z } from "zod";

import { eventFormDefinition } from "./eventFormDefinition";

const isValidDateString = (value: string) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const createSchemaFromConfig = <
  TFields extends readonly { name: string; validate: z.ZodTypeAny }[],
>(
  fields: TFields,
) => {
  const shape = fields.reduce<Record<string, z.ZodTypeAny>>((acc, field) => {
    acc[field.name] = field.validate;
    return acc;
  }, {});

  return z.object(shape);
};

export const eventFormSchema = createSchemaFromConfig(
  eventFormDefinition.fields,
).superRefine(({ startDate, endDate }, ctx) => {
  if (
    typeof startDate !== "string" ||
    typeof endDate !== "string" ||
    !isValidDateString(startDate) ||
    !isValidDateString(endDate)
  ) {
    return;
  }

  if (new Date(endDate) < new Date(startDate)) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message: "End date must be on or after the start date",
    });
  }
});

export type EventFormData = z.infer<typeof eventFormSchema>;
export type EventFormInput = z.input<typeof eventFormSchema>;
