import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ErrorState, PageHeader } from "@/components/common"
import { Skeleton } from "@/components/ui/skeleton"
import { ngoProfileSchema, toUpdateNgoProfileRequest, type NgoProfileFormValues } from "../schemas/ngoProfileSchema"
import { useNgoProfile, useUpdateNgoProfile } from "../hooks/useNgoProfile"

export function NgoProfilePage() {
  const profileQuery = useNgoProfile()
  const updateProfile = useUpdateNgoProfile()
  const form = useForm<NgoProfileFormValues>({
    resolver: zodResolver(ngoProfileSchema) as Resolver<NgoProfileFormValues>,
    defaultValues: {
      ngoName: "",
      registrationNumber: "",
      contactPerson: "",
      phone: "",
      description: "",
      country: "",
      state: "",
      city: "",
      street: "",
      active: true,
    },
  })

  useEffect(() => {
    const profile = profileQuery.data

    if (profile) {
      form.reset({
        ngoName: profile.ngoName ?? "",
        registrationNumber: profile.registrationNumber ?? "",
        contactPerson: profile.contactPerson ?? "",
        phone: profile.phone ?? "",
        description: profile.description ?? "",
        country: profile.address?.country ?? "",
        state: profile.address?.state ?? "",
        city: profile.address?.city ?? "",
        street: profile.address?.street ?? "",
        pinCode: profile.address?.pinCode,
        active: profile.active ?? true,
      })
    }
  }, [form, profileQuery.data])

  return (
    <div className="space-y-6">
      <PageHeader title="NGO Profile" description="Maintain your organization details, registration info, and contact information." />
      {profileQuery.isLoading ? <Skeleton className="h-96" /> : null}
      {profileQuery.isError ? <ErrorState message={profileQuery.error.message} onRetry={() => void profileQuery.refetch()} /> : null}
      {updateProfile.isError ? <ErrorState message={updateProfile.error.message} /> : null}
      {profileQuery.data ? (
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={form.handleSubmit((values) => updateProfile.mutate(toUpdateNgoProfileRequest(values)))}>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="ngoName">NGO Name</FieldLabel>
                    <Input id="ngoName" {...form.register("ngoName")} />
                    <FieldError errors={[form.formState.errors.ngoName]} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="registrationNumber">Registration Number</FieldLabel>
                    <Input id="registrationNumber" {...form.register("registrationNumber")} />
                    <FieldError errors={[form.formState.errors.registrationNumber]} />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="contactPerson">Contact Person</FieldLabel>
                    <Input id="contactPerson" {...form.register("contactPerson")} />
                    <FieldError errors={[form.formState.errors.contactPerson]} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input id="phone" {...form.register("phone")} />
                    <FieldError errors={[form.formState.errors.phone]} />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Input id="country" {...form.register("country")} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="state">State</FieldLabel>
                    <Input id="state" {...form.register("state")} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="pinCode">PIN Code</FieldLabel>
                    <Input id="pinCode" type="number" {...form.register("pinCode")} />
                    <FieldError errors={[form.formState.errors.pinCode]} />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input id="city" {...form.register("city")} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="street">Street</FieldLabel>
                    <Input id="street" {...form.register("street")} />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea id="description" {...form.register("description")} />
                  <FieldError errors={[form.formState.errors.description]} />
                </Field>

                <label className="flex items-center gap-2 text-sm font-medium">
                  <input className="size-4 accent-blue-700" type="checkbox" {...form.register("active")} />
                  Profile active
                </label>
              </FieldGroup>

              <div className="flex justify-end">
                <Button disabled={updateProfile.isPending} type="submit" className="bg-blue-700 hover:bg-blue-800">
                  {updateProfile.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
