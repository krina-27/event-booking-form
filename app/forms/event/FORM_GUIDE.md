# Event Form Guide

This guide explains these files:

- `app/forms/event/eventSchema.ts`
- `app/forms/event/EventForm.tsx`

The goal is to help you understand:

- what Zod is doing
- what `react-hook-form` is doing
- how both are connected in your form

## Big Picture

Your form works like this:

1. The user types values into the UI
2. `react-hook-form` collects those values
3. `zodResolver` sends them to Zod
4. Zod validates the values using `eventSchema`
5. If invalid, errors are shown in the form
6. If valid, `onSubmit` receives clean typed data

## What Zod Is

Zod is a validation library.

You use it to define:

- the shape of the form data
- the validation rules
- the final output type

In your project, Zod is used in `eventSchema.ts`.

## `eventSchema.ts`

### Import

```ts
import { z } from "zod";
```

`z` gives you functions like:

- `z.string()`
- `z.number()`
- `z.enum()`
- `z.object()`

## Utility Functions

You created two helper functions:

```ts
const isValidDateString = (value: string) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};
```

This checks whether a string can become a valid date.

```ts
const isTodayOrFuture = (value: string) => {
  const selectedDate = new Date(value);
  selectedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today;
};
```

This checks whether the date is today or later.

## Main Schema

```ts
export const eventSchema = z.object({
  eventName: ...,
  eventType: ...,
  startDate: ...,
  endDate: ...,
  guests: ...,
});
```

This means the form data must be an object with these fields.

## Field-by-Field Explanation

### `eventName`

```ts
eventName: z
  .string()
  .trim()
  .min(3, "Event name must be at least 3 characters long")
  .max(255, "Event name must be less than 255 characters long")
```

What it means:

- the field must be text
- `.trim()` removes extra spaces at the start and end
- `.min(3)` means at least 3 characters
- `.max(255)` means no more than 255 characters

Example:

- `"My Event"` -> valid
- `"ab"` -> invalid

### `eventType`

```ts
eventType: z.enum(EVENT_TYPES, {
  error: "Please select a valid event type",
})
```

What it means:

- only values from `EVENT_TYPES` are allowed

If `EVENT_TYPES` is:

```ts
["Conference", "Workshop", "Webinar", "Meetup", "Party"]
```

then only those exact values are valid.

### `startDate`

```ts
startDate: z
  .string()
  .min(1, "Start date is required")
  .refine(isValidDateString, {
    message: "Please enter a valid start date",
  })
  .refine(isTodayOrFuture, {
    message: "Start date cannot be in the past",
  })
```

What it means:

- it must be filled
- it must be a valid date
- it cannot be before today

### `endDate`

```ts
endDate: z
  .string()
  .min(1, "End date is required")
  .refine(isValidDateString, {
    message: "Please enter a valid end date",
  })
```

What it means:

- it must be filled
- it must be a valid date

### `guests`

```ts
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
  )
```

This field is important because the input is `type="text"`, not `type="number"`.

So the browser gives this field as a string.

Zod handles everything:

1. Accept it as text
2. Remove extra spaces
3. Make sure it is not empty
4. Make sure it contains only digits
5. Convert it to a number
6. Make sure the number is at least `1`

Examples:

- `"25"` -> valid
- `" 25 "` -> valid
- `""` -> invalid
- `"abc"` -> invalid
- `"12.5"` -> invalid
- `"-2"` -> invalid

## Cross-Field Validation

This part checks two fields together:

```ts
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
```

Why `superRefine` is needed:

- normal field validation checks one field at a time
- this rule needs both `startDate` and `endDate`

What it does:

- if `endDate` is before `startDate`, it adds an error to `endDate`

## Types Created from Zod

```ts
export type EventFormData = z.infer<typeof eventSchema>;
export type EventFormInput = z.input<typeof eventSchema>;
```

These two types are useful because your form has a transformation.

### `EventFormInput`

This is the raw input type before Zod transforms.

In this type:

- `guests` is a string

because the form input is text.

### `EventFormData`

This is the final validated output type after transforms.

In this type:

- `guests` is a number

because Zod converted it with:

```ts
.transform((value) => Number.parseInt(value, 10))
```

## What `react-hook-form` Is

`react-hook-form` manages:

- field values
- form submission
- validation state
- error messages
- submit state

It is used in `EventForm.tsx`.

## `EventForm.tsx`

### Setup

```ts
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
```

## What Each Part Means

### `useForm(...)`

Creates the form state.

### `zodResolver(eventSchema)`

This connects `react-hook-form` to Zod.

It means:

- when the form is submitted
- the values are validated by `eventSchema`
- errors are returned into `errors`

### `defaultValues`

These are the starting values of the form.

Example:

- `eventName` starts as `""`
- `guests` starts as `""`

## `register(...)`

Use `register` for normal inputs.

Example:

```tsx
<Input {...register("eventName")} />
```

This connects the input to the form state.

You use `register` for:

- event name
- start date
- end date
- guests

## `Controller`

Use `Controller` for custom components that do not behave like a normal HTML input.

Your `Select` component is one of those.

Example:

```tsx
<Controller
  control={control}
  name="eventType"
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      ...
    </Select>
  )}
/>
```

This lets `react-hook-form` control the custom select.

## `handleSubmit`

You use it here:

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
```

What it does:

1. collect form values
2. validate them with Zod
3. if valid, call `onSubmit`
4. if invalid, fill `errors`

## `errors`

This contains validation errors from Zod.

Example:

```tsx
error={errors.eventName?.message}
```

If there is an error, the message is shown.

If not, it is `undefined`.

## `isSubmitting`

This becomes `true` while the form submit function is running.

That is why your button can do this:

```tsx
{isSubmitting ? "Submitting..." : "Submit"}
```

## Example of a Registered Input

```tsx
<Input
  type="text"
  placeholder="Enter number of guests"
  aria-invalid={Boolean(errors.guests)}
  {...register("guests")}
/>
```

What this does:

- keeps the input inside form state
- marks it invalid when there is an error
- lets Zod validate it on submit

## Submit Function

```ts
const onSubmit = async (values: EventFormData) => {
  console.log("Event booking submitted:", values);
};
```

Notice that `values` is typed as `EventFormData`.

That means:

- validation already passed
- Zod transforms already ran
- `guests` is a number here, not a string

## Simple Guests Example

User types:

```txt
45
```

Form receives:

```ts
{ guests: "45" }
```

Zod validates and transforms it into:

```ts
{ guests: 45 }
```

So inside `onSubmit`, `guests` is a real number.

## When to Use What

Use `register(...)` for:

- text inputs
- date inputs
- normal HTML form fields

Use `Controller` for:

- custom select components
- third-party UI inputs
- components that do not expose a normal input API

Use Zod for:

- required fields
- string length validation
- custom messages
- text-to-number conversion
- comparing fields like start and end date

## Current File Roles

### `eventSchema.ts`

This file:

- defines validation rules
- defines the data types
- transforms `guests` from string to number

### `EventForm.tsx`

This file:

- renders the form UI
- connects inputs to `react-hook-form`
- shows validation errors
- submits validated data

## Short Mental Model

You can remember it like this:

- `react-hook-form` manages the form
- Zod validates the form
- `zodResolver` connects both

So:

- UI handling -> `react-hook-form`
- validation rules -> Zod
- bridge between them -> `zodResolver`

