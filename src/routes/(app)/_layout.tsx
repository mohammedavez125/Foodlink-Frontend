import {
    Outlet,
    createFileRoute,
} from "@tanstack/react-router"

import { requireAuth }
    from "@/auth/requireAuth"

export const Route =
    createFileRoute("/(app)/_layout")({
        beforeLoad() {
            requireAuth()
        },

        component: () => (
            <Outlet />
        ),
    })