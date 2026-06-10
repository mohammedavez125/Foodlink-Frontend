import type { CreateDonationRequest, DonationResponse, UpdateDonationRequest } from "@/services/openapi/generated"
import { api } from "@/api/client"

export async function getMyDonations(): Promise<DonationResponse[]> {
  const response = await api.get<DonationResponse[]>("/donations/my-donations")
  return response.data
}
export async function getMyAcceptedDonations(): Promise<DonationResponse[]> {
  const response = await api.get<DonationResponse[]>("/donations/my-accepted-donations")
  return response.data
}

export async function getAvailableDonations(): Promise<DonationResponse[]> {
  const response = await api.get<DonationResponse[]>("/donations/available-donations")
  return response.data
}

export async function getDonationById(donationId: string): Promise<DonationResponse> {
  const results = await Promise.allSettled([getMyDonations(), getAvailableDonations(), getMyAcceptedDonations()])
  const donations = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
  const donation = donations.find((item) => item.id === donationId)

  if (!donation) {
    throw new Error("Donation not found")
  }

  return donation
}
export async function getAcceptedDonationById(donationId: string): Promise<DonationResponse> {
  const results = await Promise.allSettled([getMyAcceptedDonations(), getAvailableDonations()])
  const donations = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
  const donation = donations.find((item) => item.id === donationId)

  if (!donation) {
    throw new Error("Donation not found")
  }

  return donation
}


export async function createDonation(payload: CreateDonationRequest): Promise<DonationResponse> {
  const response = await api.post<DonationResponse>("/donations/create-donation", payload)
  return response.data
}

export async function updateDonation(donationId: string, payload: UpdateDonationRequest): Promise<DonationResponse> {
  const response = await api.put<DonationResponse>(`/donations/update-donation/${donationId}`, payload)
  return response.data
}

export async function deleteDonation(donationId: string): Promise<void> {
  await api.delete(`/donations/delete-donation/${donationId}`)
}

export async function acceptDonation(donationId: string): Promise<DonationResponse> {
  const response = await api.post<DonationResponse>(`/donations/${donationId}/accept-donation`)
  return response.data
}
