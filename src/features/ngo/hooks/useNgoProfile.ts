import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { UpdateNgoProfileRequest } from "@/services/openapi/generated"
import { getErrorMessage } from "@/services/api-error"
import { queryKeys } from "@/services/query-keys"
import { getMyNgoProfile, updateMyNgoProfile } from "../api/ngoApi"

export function useNgoProfile() {
  return useQuery({
    queryKey: queryKeys.ngoProfile,
    queryFn: getMyNgoProfile,
  })
}

export function useUpdateNgoProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateNgoProfileRequest) => updateMyNgoProfile(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ngoProfile })
      toast.success("Profile updated.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
