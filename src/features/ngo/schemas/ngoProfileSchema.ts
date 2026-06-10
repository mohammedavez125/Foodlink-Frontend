import { z } from "zod"

export const ngoProfileSchema = z.object({
  ngoName: z.string().min(2, "NGO name is required"),
  registrationNumber: z.string().min(2, "Registration number is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  phone: z.string().min(8, "Phone number is required"),
  description: z.string().max(500).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  pinCode: z.coerce.number().int().positive().optional(),
  active: z.boolean().optional(),
})

export type NgoProfileFormValues = z.infer<typeof ngoProfileSchema>

export function toUpdateNgoProfileRequest(values: NgoProfileFormValues) {
  return {
    ngoName: values.ngoName,
    registrationNumber: values.registrationNumber,
    contactPerson: values.contactPerson,
    phone: values.phone,
    description: values.description,
    active: values.active,
    address: {
      country: values.country,
      state: values.state,
      city: values.city,
      street: values.street,
      pinCode: values.pinCode,
    },
  }
}
