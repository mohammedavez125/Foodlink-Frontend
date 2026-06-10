import { isAxiosError } from "axios"

export interface ApiFieldError {
  field: string
  message: string
}

export interface NormalizedApiError {
  message: string
  status?: number
  fields: ApiFieldError[]
}

function readMessage(data: unknown): string | undefined {
  if (typeof data === "string") {
    return data
  }

  if (typeof data !== "object" || data === null) {
    return undefined
  }

  const record = data as Record<string, unknown>
  const message = record.message ?? record.error ?? record.detail

  return typeof message === "string" ? message : undefined
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (!isAxiosError(error)) {
    return {
      message: error instanceof Error ? error.message : "Something went wrong",
      fields: [],
    }
  }

  const data = error.response?.data
  const fields: ApiFieldError[] = []

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>
    const errors = record.errors

    if (Array.isArray(errors)) {
      for (const item of errors) {
        if (typeof item === "object" && item !== null) {
          const fieldError = item as Record<string, unknown>
          const field = fieldError.field
          const message = fieldError.message ?? fieldError.defaultMessage

          if (typeof field === "string" && typeof message === "string") {
            fields.push({ field, message })
          }
        }
      }
    }
  }

  return {
    message: readMessage(data) ?? error.message ?? "Request failed",
    status: error.response?.status,
    fields,
  }
}

export function getErrorMessage(error: unknown): string {
  return normalizeApiError(error).message
}
