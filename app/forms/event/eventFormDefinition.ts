import type { HTMLInputTypeAttribute } from "react";
import { z } from "zod";

import { EVENT_TYPES } from "./constansts";

const isValidDateString = (value: string) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const isTodayOrFuture = (value: string) => {
  const selectedDate = new Date(value);
  selectedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today;
};

type BaseFieldSchema = {
  name: string;
  label: string;
  component: "TEXT_FIELD" | "DATE_FIELD" | "SELECT_FIELD";
  isRequired?: boolean;
  placeholder?: string;
  defaultValue?: string | undefined;
  columnSpan?: 1 | 2;
  validate: z.ZodTypeAny;
};

type TextFieldSchema = BaseFieldSchema & {
  component: "TEXT_FIELD";
  inputType?: HTMLInputTypeAttribute;
};

type DateFieldSchema = BaseFieldSchema & {
  component: "DATE_FIELD";
};

type SelectFieldSchema = BaseFieldSchema & {
  component: "SELECT_FIELD";
  options: readonly {
    label: string;
    value: string;
  }[];
};

export type EventFieldSchema =
  | TextFieldSchema
  | DateFieldSchema
  | SelectFieldSchema;

export const eventFormDefinition = {
  title: "Event Booking",
  submitButtonLabel: "Submit",
  submittingButtonLabel: "Submitting...",
  fields: [
    {
      component: "TEXT_FIELD",
      name: "eventName",
      label: "Event Name",
      placeholder: "Enter event name",
      isRequired: true,
      defaultValue: "",
      inputType: "text",
      columnSpan: 1,
      validate: z
        .string()
        .trim()
        .min(1, "Event name is required")
        .min(3, "Event name must be at least 3 characters long")
        .max(255, "Event name must be less than 255 characters long"),
    },
    {
      component: "SELECT_FIELD",
      name: "eventType",
      label: "Event Type",
      placeholder: "Select event type",
      isRequired: true,
      defaultValue: undefined,
      columnSpan: 1,
      options: EVENT_TYPES.map((eventType) => ({
        label: eventType,
        value: eventType,
      })),
      validate: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.enum(EVENT_TYPES, {
          error: "Please select a valid event type",
        }),
      ),
    },
    {
      component: "DATE_FIELD",
      name: "startDate",
      label: "Start Date",
      isRequired: true,
      defaultValue: "",
      columnSpan: 1,
      validate: z
        .string()
        .min(1, "Start date is required")
        .refine(isValidDateString, {
          message: "Please enter a valid start date",
        })
        .refine(isTodayOrFuture, {
          message: "Start date cannot be in the past",
        }),
    },
    {
      component: "DATE_FIELD",
      name: "endDate",
      label: "End Date",
      isRequired: true,
      defaultValue: "",
      columnSpan: 1,
      validate: z
        .string()
        .min(1, "End date is required")
        .refine(isValidDateString, {
          message: "Please enter a valid end date",
        }),
    },
    {
      component: "TEXT_FIELD",
      name: "guests",
      label: "Number of Guests",
      placeholder: "Enter number of guests",
      isRequired: true,
      defaultValue: "",
      inputType: "text",
      columnSpan: 2,
      validate: z
        .string()
        .trim()
        .min(1, "Number of guests is required")
        .regex(/^\d+$/, "Number of guests must be a valid number")
        .transform((value) => Number.parseInt(value, 10))
        .pipe(
          z
            .number()
            .int("Number of guests must be a whole number")
            .min(1, "Number of guests must be at least 1"),
        ),
    },
  ] satisfies EventFieldSchema[],
} as const;
