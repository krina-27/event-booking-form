// forms/event/EventForm.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormRenderer } from "@/app/components/form/FormRenderer";
import { getDefaultValues } from "@/lib/form-defaults";

import { eventFormDefinition } from "./eventFormDefinition";
import { type EventFormData, type EventFormInput } from "./eventForm.schema";

const defaultValues = getDefaultValues<EventFormInput>(
  eventFormDefinition.fields,
);

export default function EventForm() {
  const onSubmit = async (values: EventFormData) => {
    console.log("Event booking submitted:", values);
  };

  return (
    <div className="max-w-full w-5/6 mx-auto mt-10">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{eventFormDefinition.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <FormRenderer
            fields={eventFormDefinition.fields}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            submitButtonLabel={eventFormDefinition.submitButtonLabel}
            submittingButtonLabel={eventFormDefinition.submittingButtonLabel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
