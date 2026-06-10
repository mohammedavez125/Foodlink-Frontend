import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { UpdateDonorProfileRequest } from "@/services/openapi/generated"
import { getErrorMessage } from "@/services/api-error"
import { queryKeys } from "@/services/query-keys"
import { getMyDonorProfile, updateMyDonorProfile } from "../api/donorApi"

export function useDonorProfile() {
  return useQuery({
    queryKey: queryKeys.donorProfile,
    queryFn: getMyDonorProfile,
  })
}

export function useUpdateDonorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateDonorProfileRequest) => updateMyDonorProfile(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.donorProfile })
      toast.success("Profile updated.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
