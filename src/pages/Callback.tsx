import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/auth/authStore";
import { getRoleNameFromValue } from "@/auth/roles";
import type { Role } from "@/types/auth";

function parseRoleParam(roleParam: string): unknown {
    try {
        return JSON.parse(decodeURIComponent(roleParam));
    } catch {
        return decodeURIComponent(roleParam);
    }
}

export function OAuthCallback() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);

    useEffect(() => {
        const getParams = () => {
            let p = new URLSearchParams(window.location.search);
            if (p.has("token")) return p;

            if (window.location.hash) {
                const hash = window.location.hash.substring(1);
                p = new URLSearchParams(hash);
                if (p.has("token")) return p;
            }
            return null;
        };

        const params = getParams();
        if (!params) return;

        const token = params.get("token");
        const username = params.get("username");
        const email = params.get("email");
        const role = params.get("role");

        if (token && username && email && role) {
            console.log("OAuthCallback: Params detected", { 
                token,
                username, 
                email, 
                role 
            });
            try {
                const parsedRole = parseRoleParam(role);
                console.log("OAuthCallback: Decoded role", parsedRole);
                
                login(token, {
                    username,
                    email,
                    role: parsedRole as Role,
                });

                const roleName = getRoleNameFromValue(parsedRole);
                
                // Use a micro-tick to ensure state is committed before navigation
                setTimeout(() => {
                    if (roleName === "NGO") {
                        navigate({ to: "/ngo/dashboard" });
                    } else if (roleName === "DONOR") {
                        navigate({ to: "/donor/dashboard" });
                    } else {
                        navigate({ to: "/home" });
                    }
                }, 10);
            } catch (e) {
                console.error("OAuthCallback: Failed to parse role or redirect", e);
                navigate({ to: "/login" });
            }
        }
    }, [login, navigate]);

    return <div>Signing in...</div>;
}
