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

export const eventSchema = z
  .object({
    eventName: z
      .string()
      .trim()
      .min(3, "Event name must be at least 3 characters long")
      .max(255, "Event name must be less than 255 characters long"),
    eventType: z
      .enum(EVENT_TYPES, {
        error: "Please select a valid event type",
      })
      .optional(),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine(isValidDateString, {
        message: "Please enter a valid start date",
      })
      .refine(isTodayOrFuture, {
        message: "Start date cannot be in the past",
      }),
    endDate: z
      .string()
      .min(1, "End date is required")
      .refine(isValidDateString, {
        message: "Please enter a valid end date",
      }),
    guests: z
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
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
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

export type EventFormData = z.infer<typeof eventSchema>;
export type EventFormInput = z.input<typeof eventSchema>;
