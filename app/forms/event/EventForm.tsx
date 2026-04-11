// forms/event/EventForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormField } from "../../components/form/FormField";
import {
  eventSchema,
  type EventFormData,
  type EventFormInput,
} from "./eventSchema";
import { EVENT_TYPES } from "./constansts";

export default function EventForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormInput, undefined, EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: "",
      eventType: undefined,
      startDate: "",
      endDate: "",
      guests: "",
    },
  });

  const onSubmit = async (values: EventFormData) => {
    console.log("Event booking submitted:", values);
  };

  return (
    <div className="max-w-full w-5/6 mx-auto mt-10">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Event Booking</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Event Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Event Name" error={errors.eventName?.message}>
                <Input
                  placeholder="Enter event name"
                  aria-invalid={Boolean(errors.eventName)}
                  {...register("eventName")}
                />
              </FormField>

              <FormField label="Event Type" error={errors.eventType?.message}>
                <Controller
                  control={control}
                  name="eventType"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      name={field.name}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={Boolean(errors.eventType)}
                      >
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map((eventType) => (
                          <SelectItem key={eventType} value={eventType}>
                            {eventType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Start Date" error={errors.startDate?.message}>
                <Input
                  type="date"
                  aria-invalid={Boolean(errors.startDate)}
                  {...register("startDate")}
                />
              </FormField>

              <FormField label="End Date" error={errors.endDate?.message}>
                <Input
                  type="date"
                  aria-invalid={Boolean(errors.endDate)}
                  {...register("endDate")}
                />
              </FormField>
            </div>

            {/* Guests */}
            <FormField label="Number of Guests" error={errors.guests?.message}>
              <Input
                type="text"
                placeholder="Enter number of guests"
                aria-invalid={Boolean(errors.guests)}
                {...register("guests")}
              />
            </FormField>

            {/* Submit */}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
