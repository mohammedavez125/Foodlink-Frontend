import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AcceptDonationRequest, CreateDonationRequest, UpdateDonationRequest } from "@/services/openapi/generated"
import { getErrorMessage } from "@/services/api-error"
import { queryKeys } from "@/services/query-keys"
import {
  acceptDonation,
  completeDonation,
  createDonation,
  deleteDonation,
  dispatchDonation,
  getAvailableDonations,
  getDonorHistory,
  getDonationById,
  getMyAcceptedDonations,
  getMyDonations,
  getNgoHistory,
  receiveDonation,
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

export function useMyAcceptedDonations() {
  return useQuery({
    queryKey: queryKeys.donations.accepted,
    queryFn: getMyAcceptedDonations,
  })
}

export function useDonorHistory() {
  return useQuery({
    queryKey: queryKeys.donorHistory,
    queryFn: getDonorHistory,
  })
}

export function useNgoHistory() {
  return useQuery({
    queryKey: queryKeys.ngoHistory,
    queryFn: getNgoHistory,
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.donorHistory })
      void queryClient.invalidateQueries({ queryKey: queryKeys.ngoHistory })
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.donorHistory })
      void queryClient.invalidateQueries({ queryKey: queryKeys.ngoHistory })
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.donorHistory })
      void queryClient.invalidateQueries({ queryKey: queryKeys.ngoHistory })
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
    mutationFn: ({ donationId, payload }: { donationId: string; payload: AcceptDonationRequest }) =>
      acceptDonation(donationId, payload),
    onSuccess: (donation) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.donations.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.donorHistory })
      void queryClient.invalidateQueries({ queryKey: queryKeys.ngoHistory })
      if (donation.id) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.donations.detail(donation.id) })
      }
      toast.success("Donation accepted.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDispatchDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (donationId: string) => dispatchDonation(donationId),
    onSuccess: (donation) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.donations.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.donorHistory })
      void queryClient.invalidateQueries({ queryKey: queryKeys.ngoHistory })
      if (donation.id) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.donations.detail(donation.id) })
      }
      toast.success("Donation dispatched.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useReceiveDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (donationId: string) => receiveDonation(donationId),
    onSuccess: (donation) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.donations.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.donorHistory })
      void queryClient.invalidateQueries({ queryKey: queryKeys.ngoHistory })
      if (donation.id) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.donations.detail(donation.id) })
      }
      toast.success("Donation marked received.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useCompleteDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (donationId: string) => completeDonation(donationId),
    onSuccess: (donation) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.donations.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.donorHistory })
      void queryClient.invalidateQueries({ queryKey: queryKeys.ngoHistory })
      if (donation.id) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.donations.detail(donation.id) })
      }
      toast.success("Donation completed.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
