import { z } from "zod";
import { EVENT_TYPES } from "./constansts";

export const eventSchema = z
  .object({
    eventName: z
      .string()
      .trim()
      .min(3, "Event name must be at least 3 characters long")
      .max(255, "Event name must be less than 255 characters long"),
    eventType: z.enum(EVENT_TYPES, {
      error:
        "Invalid event type. Must be one of: Conference, Workshop, Webinar, Meetup, Party",
    }),
    startDate: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (date) => {
          if (!date) return true;
          const startDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return startDate >= today;
        },
        {
          error: "Invalid start date. Please enter a future date.",
        },
      ),
    endDate: z.string().optional().or(z.literal("")),
    guests: z
      .string()
      .trim()
      .regex(/^\d+$/, "Number of guests must be a valid number")
      .transform((value) => (!value ? null : parseInt(value))),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return endDate >= startDate;
      }
      return true;
    },
    {
      error: "Invalid end date. End date must be after start date.",
      path: ["endDate"],
    },
  );

export type EventFormData = z.infer<typeof eventSchema>;
