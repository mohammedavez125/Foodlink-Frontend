import type { DonorProfileResponse, UpdateDonorProfileRequest } from "@/services/openapi/generated"
import { api } from "@/api/client"

export async function getMyDonorProfile(): Promise<DonorProfileResponse> {
  const response = await api.get<DonorProfileResponse>("/donor/profile/get-my-profile")
  return response.data
}

export async function updateMyDonorProfile(payload: UpdateDonorProfileRequest): Promise<DonorProfileResponse> {
  const response = await api.put<DonorProfileResponse>("/donor/profile/update-my-profile", payload)
  return response.data
}
