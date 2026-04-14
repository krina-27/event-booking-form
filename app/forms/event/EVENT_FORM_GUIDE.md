# Event Form Guide

This guide explains the current form in simple terms.

Files to read:

- `app/forms/event/eventFormDefinition.ts`
- `app/forms/event/eventForm.schema.ts`
- `app/components/form/FormRenderer.tsx`
- `app/components/form/FormRendererField.tsx`
- `app/forms/event/EventForm.tsx`

## Big Picture

Your form now works in this order:

1. `eventFormDefinition.ts` describes the fields.
2. `eventForm.schema.ts` builds the Zod schema from those fields.
3. `FormRenderer.tsx` creates the React Hook Form.
4. `FormRendererField.tsx` decides which UI element to show for each field.
5. `EventForm.tsx` connects everything together.

So now:

- field structure comes from one place
- validation rules come from the same field list
- UI is rendered by looping over `fields`

That is what makes it form-definition-driven.

## 1. `eventFormDefinition.ts`

This file is the main source for the form structure.

It contains:

- form title
- submit button text
- list of fields
- validation for each field
- default value for each field

Example shape:

```ts
export const eventFormDefinition = {
  title: "Event Booking",
  fields: [
    {
      component: "TEXT_FIELD",
      name: "eventName",
      label: "Event Name",
      validate: z.string().min(1, "Event name is required"),
    },
  ],
};
```

Each field object explains:

- what UI to render
- what the field name is
- what label to show
- what validation to run

### Why this file matters

Before this change, your JSX was manually writing:

- event name input
- event type select
- start date input
- end date input
- guests input

Now those fields are described as data inside `fields`.

That means if you add another field later, you mostly add one more object.

## 2. `eventForm.schema.ts`

This file creates the Zod object schema from the field list.

Main idea:

```ts
const shape = fields.reduce((acc, field) => {
  acc[field.name] = field.validate;
  return acc;
}, {});

return z.object(shape);
```

This means:

- for each field
- take `field.name`
- take `field.validate`
- put it into the final Zod object

So if your field list has:

- `eventName`
- `eventType`
- `startDate`

the schema becomes:

```ts
z.object({
  eventName: ...,
  eventType: ...,
  startDate: ...,
});
```

### Cross-field validation

Some rules need more than one field.

Example:

- `endDate` should not be before `startDate`

That is why this file still uses `superRefine`.

Field-level validation comes from the field list.

Cross-field validation stays here because it needs access to multiple values.

## 3. `FormRenderer.tsx`

This file creates the actual RHF form.

It does three jobs:

- creates `useForm(...)`
- connects Zod using `zodResolver`
- loops over `fields` and renders each one

Important part:

```tsx
{fields.map((field) => (
  <FormRendererField
    key={field.name}
    field={field}
    register={register}
    control={control}
    errors={errors}
  />
))}
```

This loop is the main difference from your old code.

Before:

- you manually wrote one input block for every field

Now:

- you loop over the field list
- the renderer creates each field automatically

## 4. `FormRendererField.tsx`

This file decides which component to render based on `field.component`.

It works like this:

- if `component === "TEXT_FIELD"` -> render `<Input />`
- if `component === "DATE_FIELD"` -> render date input
- if `component === "SELECT_FIELD"` -> render `<Select />`

This is the same idea as your original example where:

```ts
const componentMapping = {
  TEXT_FIELD: TextField,
  CHECKBOX: Checkbox,
};
```

The difference is that here we use RHF directly.

### Why `register` and `Controller` are both used

Use `register(...)` for normal HTML-like inputs:

- text input
- date input

Use `Controller` for custom components:

- select

Your select is not a plain native input, so `Controller` is required.

## 5. `EventForm.tsx`

This file is now much smaller.

Its job is:

- import the form definition
- set default values
- define `onSubmit`
- render the card layout
- pass data into `FormRenderer`

So `EventForm.tsx` is now the page-level form container, not the place where every field is manually written.

## How One Field Flows Through The App

Take `guests` as an example.

### In `eventFormDefinition.ts`

You define:

- label
- placeholder
- component type
- validation

### In `eventForm.schema.ts`

The `guests` validation becomes part of the final Zod object.

### In `FormRenderer.tsx`

The renderer loops over the fields and sends `guests` to `FormRendererField`.

### In `FormRendererField.tsx`

Because `guests` uses `TEXT_FIELD`, it renders an `<Input />`.

### On submit

Zod validates it and transforms it from string to number.

So:

- input value in browser: `"25"`
- final submit value: `25`

## Why This Is Better Than The Old Version

Your old version had good validation, but the UI structure was still hardcoded.

Now the benefits are:

- one place defines the fields
- validation stays close to the field definition
- renderer becomes reusable
- adding new fields becomes simpler
- page component becomes smaller and easier to read

## Simple Mental Model

You can remember the files like this:

- `eventFormDefinition.ts` = what fields exist
- `eventForm.schema.ts` = how those fields are validated together
- `FormRenderer.tsx` = how the form is created and submitted
- `FormRendererField.tsx` = how each field UI is chosen
- `EventForm.tsx` = where the form is placed on the page

## If You Want To Add A New Field Later

Example: add a description field.

You mostly add one object inside `fields`:

```ts
{
  component: "TEXT_FIELD",
  name: "description",
  label: "Description",
  placeholder: "Enter description",
  defaultValue: "",
  validate: z.string().min(1, "Description is required"),
}
```

After that:

- schema includes it automatically
- renderer shows it automatically
- RHF tracks it automatically

That is the main goal of this pattern.
