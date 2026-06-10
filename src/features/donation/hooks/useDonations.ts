import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { CreateDonationRequest, UpdateDonationRequest } from "@/services/openapi/generated"
import { getErrorMessage } from "@/services/api-error"
import { queryKeys } from "@/services/query-keys"
import {
  acceptDonation,
  createDonation,
  deleteDonation,
  getAvailableDonations,
  getDonationById,
  getMyDonations,
  updateDonation,
} from "../api/donationApi"

export function useMyDonations() {
  return useQuery({
    queryKey: queryKeys.donations.mine,
    queryFn: getMyDonations,
  })
}

export function useAvailableDonations() {
  return useQuery({
    queryKey: queryKeys.donations.available,
    queryFn: getAvailableDonations,
  })
}

export function useDonation(donationId: string) {
  return useQuery({
    queryKey: queryKeys.donations.detail(donationId),
    queryFn: () => getDonationById(donationId),
    enabled: Boolean(donationId),
  })
}

export function useCreateDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateDonationRequest) => createDonation(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.donations.all })
      toast.success("Donation created and shared with NGOs.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useUpdateDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ donationId, payload }: { donationId: string; payload: UpdateDonationRequest }) =>
      updateDonation(donationId, payload),
    onSuccess: (donation) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.donations.all })
      if (donation.id) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.donations.detail(donation.id) })
      }
      toast.success("Donation updated.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (donationId: string) => deleteDonation(donationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.donations.all })
      toast.success("Donation deleted.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useAcceptDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (donationId: string) => acceptDonation(donationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.donations.all })
      toast.success("Donation accepted.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
