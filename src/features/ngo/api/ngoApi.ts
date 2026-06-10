import type { NgoProfileResponse, UpdateNgoProfileRequest } from "@/services/openapi/generated"
import { api } from "@/api/client"

export async function getMyNgoProfile(): Promise<NgoProfileResponse> {
  const response = await api.get<NgoProfileResponse>("/ngo/profile/get-my-profile")
  return response.data
}

export async function updateMyNgoProfile(payload: UpdateNgoProfileRequest): Promise<NgoProfileResponse> {
  const response = await api.put<NgoProfileResponse>("/ngo/profile/update-my-profile", payload)
  return response.data
}
