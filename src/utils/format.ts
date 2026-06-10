export function formatDateTime(value?: string): string {
  if (!value) {
    return "Not provided"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function readOptionalString(source: object, key: string): string | undefined {
  const value = (source as Record<string, unknown>)[key]
  return typeof value === "string" ? value : undefined
}
