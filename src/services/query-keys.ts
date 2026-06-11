export const queryKeys = {
  donations: {
    all: ["donations"] as const,
    mine: ["donations", "mine"] as const,
    available: ["donations", "available"] as const,
    accepted: ["donations", "accepted"] as const,
    detail: (id: string) => ["donations", "detail", id] as const,
  },
  donorHistory: ["donor-history"] as const,
  ngoHistory: ["ngo-history"] as const,
  donorProfile: ["donor", "profile"] as const,
  ngoProfile: ["ngo", "profile"] as const,
}
