import { redirect } from "@tanstack/react-router"
import { can } from "./permissions"

export function requirePermission(
    permission: string
) {
    if (!can(permission)) {
        throw redirect({
            to: "/home",
        })
    }
}