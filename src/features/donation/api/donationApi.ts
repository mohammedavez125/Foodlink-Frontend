import type {
  AcceptDonationRequest,
  CreateDonationRequest,
  DonationResponse,
  UpdateDonationRequest,
} from "@/services/openapi/generated"
import { api } from "@/api/client"
import { getRoleName } from "@/auth/roles"

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

export async function getDonorHistory(): Promise<DonationResponse[]> {
  const response = await api.get<DonationResponse[]>("/donations/history/donor")
  return response.data
}

export async function getNgoHistory(): Promise<DonationResponse[]> {
  const response = await api.get<DonationResponse[]>("/donations/history/ngo")
  return response.data
}

async function getDonationSourcesForCurrentRole(): Promise<DonationResponse[][]> {
  const roleName = getRoleName()

  if (roleName === "DONOR") {
    return Promise.all([getMyDonations(), getDonorHistory()])
  }

  if (roleName === "NGO") {
    return Promise.all([getAvailableDonations(), getMyAcceptedDonations(), getNgoHistory()])
  }

  return []
}

export async function getDonationById(donationId: string): Promise<DonationResponse> {
  const donations = (await getDonationSourcesForCurrentRole()).flat()
  const donation = donations.find((item) => item.id === donationId)

  if (!donation) {
    throw new Error("Donation not found")
  }

  return donation
}
export async function getAcceptedDonationById(donationId: string): Promise<DonationResponse> {
  const donations = await getMyAcceptedDonations()
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
  console.log("Donation request body sent", payload)
  const response = await api.put<DonationResponse>(`/donations/${donationId}`, payload)
  return response.data
}

export async function deleteDonation(donationId: string): Promise<void> {
  await api.delete(`/donations/delete-donation/${donationId}`)
}

export async function acceptDonation(donationId: string, payload: AcceptDonationRequest): Promise<DonationResponse> {
  const response = await api.post<DonationResponse>(`/donations/${donationId}/accept`, payload)
  return response.data
}

export async function dispatchDonation(donationId: string): Promise<DonationResponse> {
  const response = await api.patch<DonationResponse>(`/donations/${donationId}/dispatch`)
  return response.data
}

export async function receiveDonation(donationId: string): Promise<DonationResponse> {
  const response = await api.patch<DonationResponse>(`/donations/${donationId}/receive`)
  return response.data
}

export async function completeDonation(donationId: string): Promise<DonationResponse> {
  const response = await api.patch<DonationResponse>(`/donations/${donationId}/complete`)
  return response.data
}
