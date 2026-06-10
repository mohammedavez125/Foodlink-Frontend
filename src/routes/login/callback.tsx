import {OAuthCallback} from "@/pages/Callback.tsx";
import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/login/callback")({
    component: OAuthCallback,
});
