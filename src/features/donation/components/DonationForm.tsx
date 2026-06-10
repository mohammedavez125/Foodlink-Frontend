import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CreateDonationRequest } from "@/services/openapi/generated"
import { donationFormSchema, foodCategories, toCreateDonationRequest, type DonationFormValues } from "../schemas/donationSchema"

interface DonationFormProps {
  defaultValues?: Partial<DonationFormValues>
  submitLabel: string
  submittingLabel: string
  isSubmitting: boolean
  onSubmit: (payload: CreateDonationRequest) => void
}

const defaults: DonationFormValues = {
  foodName: "",
  category: "VEG",
  quantity: 1,
  description: "",
  pickupAddress: "",
  city: "",
  state: "",
  pinCode: "",
  latitude: 0,
  longitude: 0,
  expiryTime: "",
}

export function DonationForm({ defaultValues, submitLabel, submittingLabel, isSubmitting, onSubmit }: DonationFormProps) {
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema) as Resolver<DonationFormValues>,
    defaultValues: {
      ...defaults,
      ...defaultValues,
    },
  })

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit((values) => onSubmit(toCreateDonationRequest(values)))}>
      <FieldGroup>
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="foodName">Food Name</FieldLabel>
            <Input id="foodName" placeholder="Cooked rice meals" {...form.register("foodName")} />
            <FieldError errors={[form.formState.errors.foodName]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select id="category" {...form.register("category")}>
              {foodCategories.map((category) => (
                <option key={category} value={category}>
                  {category.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
            <FieldError errors={[form.formState.errors.category]} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
            <Input id="quantity" min={1} type="number" {...form.register("quantity")} />
            <FieldError errors={[form.formState.errors.quantity]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="expiryTime">Expiry Time</FieldLabel>
            <Input id="expiryTime" type="datetime-local" {...form.register("expiryTime")} />
            <FieldError errors={[form.formState.errors.expiryTime]} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" placeholder="Packaging, allergens, pickup notes" {...form.register("description")} />
          <FieldError errors={[form.formState.errors.description]} />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="pickupAddress">Pickup Address</FieldLabel>
            <Input id="pickupAddress" placeholder="Street and landmark" {...form.register("pickupAddress")} />
            <FieldError errors={[form.formState.errors.pickupAddress]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input id="city" {...form.register("city")} />
            <FieldError errors={[form.formState.errors.city]} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="state">State</FieldLabel>
            <Input id="state" {...form.register("state")} />
            <FieldError errors={[form.formState.errors.state]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="pinCode">PIN Code</FieldLabel>
            <Input id="pinCode" {...form.register("pinCode")} />
            <FieldError errors={[form.formState.errors.pinCode]} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
            <Input id="latitude" step="any" type="number" {...form.register("latitude")} />
            <FieldError errors={[form.formState.errors.latitude]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
            <Input id="longitude" step="any" type="number" {...form.register("longitude")} />
            <FieldError errors={[form.formState.errors.longitude]} />
          </Field>
        </div>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}

