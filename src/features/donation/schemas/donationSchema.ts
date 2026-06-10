import { z } from "zod"

export const foodCategories = ["VEG", "NON_VEG", "MIXED", "BAKERY", "FRUITS", "BEVERAGES"] as const

export const donationFormSchema = z.object({
  foodName: z.string().min(2, "Food name is required"),
  category: z.enum(foodCategories),
  quantity: z.coerce.number().int().positive("Quantity must be greater than zero"),
  description: z.string().max(500, "Description must stay under 500 characters").optional(),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().min(4, "PIN code is required"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  expiryTime: z.string().min(1, "Expiry time is required"),
})

export type DonationFormValues = z.infer<typeof donationFormSchema>

export function toCreateDonationRequest(values: DonationFormValues) {
  return {
    foodName: values.foodName,
    category: values.category,
    quantity: values.quantity,
    description: values.description,
    pickupLocation: {
      addressLine: values.pickupAddress,
      city: values.city,
      state: values.state,
      pinCode: values.pinCode,
      latitude: values.latitude,
      longitude: values.longitude,
    },
    expiryTime: new Date(values.expiryTime).toISOString(),
  }
}
