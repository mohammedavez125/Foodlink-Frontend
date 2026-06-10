export const queryKeys = {
  donations: {
    all: ["donations"] as const,
    mine: ["donations", "mine"] as const,
    available: ["donations", "available"] as const,
    detail: (id: string) => ["donations", "detail", id] as const,
  },
  donorProfile: ["donor", "profile"] as const,
  ngoProfile: ["ngo", "profile"] as const,
}
