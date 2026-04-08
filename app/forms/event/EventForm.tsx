// forms/event/EventForm.tsx
"use client";

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

export default function EventForm() {
  return (
    <div className="max-w-full w-5/6 mx-auto mt-10">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Event Booking</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            {/* Event Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Event Name">
                <Input placeholder="Enter event name" />
              </FormField>

              <FormField label="Event Type">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Start Date">
                <Input type="date" />
              </FormField>

              <FormField label="End Date">
                <Input type="date" />
              </FormField>
            </div>

            {/* Guests */}
            <FormField label="Number of Guests">
              <Input placeholder="Enter number of guests" />
            </FormField>

            {/* Submit */}
            <Button className="w-full">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
