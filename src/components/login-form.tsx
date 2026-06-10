import {useEffect, useState} from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field, FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "@/auth/authStore"


export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<"div">) {
  const navigate =
      useNavigate()

  const login =
      useAuthStore(
          (s) => s.login
      )
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()
      console.log("LoginForm: API Response Data:", data)

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      const user = {
        username: data.username,
        email: data.email,
        role: data.role
      }
      console.log("LoginForm: Login successful, user data:", user)
      login(data.token, user)
      
      setSuccess("Login successful!")
      // Allow a tiny tick for Zustand to write to localStorage if needed
      setTimeout(async () => {
        try {
          const roleName = user.role?.roleName ?? user.role?.name
          console.log("LoginForm: Redirecting to dashboard for role:", roleName)
          if (roleName === "NGO") {
            await navigate({ to: "/ngo/dashboard" })
          } else if (roleName === "DONOR") {
            await navigate({ to: "/donor/dashboard" })
          } else {
            await navigate({ to: "/home" })
          }
        } catch (navErr) {
          console.error("LoginForm: Navigation failed", navErr)
          setError("Failed to redirect. Please try refreshing.")
        }
      }, 50)
    } catch (err) {
      console.error("LoginForm: Login failed", err)
      setError(
          err instanceof Error ? err.message : "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const getParams = () => {
      // Priority 1: URL search params (?token=...)
      let p = new URLSearchParams(window.location.search);
      if (p.has("token")) return p;

      // Priority 2: URL hash params (#token=...) - common in some OIDC flows
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
    const roleParam = params.get("role");

    if (
        token &&
        username &&
        email &&
        roleParam
    ) {
      console.log("LoginForm: URL Params detected", { 
        token,
        username, 
        email, 
        roleParam 
      });
      try {
        const role = JSON.parse(
            decodeURIComponent(roleParam)
        );
        console.log("LoginForm: Decoded OIDC role", role);

        login(token, {
          username,
          email,
          role,
        });

        // Small delay for OIDC callback as well
        setTimeout(() => {
          const roleName = role?.roleName ?? role?.name
          if (roleName === "NGO") {
            navigate({ to: "/ngo/dashboard" })
          } else if (roleName === "DONOR") {
            navigate({ to: "/donor/dashboard" })
          } else {
            navigate({ to: "/home" })
          }
        }, 50);
      } catch (e) {
        console.error("LoginForm: Failed to parse OIDC role", e);
        setError("Social login failed. Please try again.");
      }
    }
  }, [login, navigate]);

  return (
      <div className={cn("flex flex-col", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
                className="p-6 md:p-8"
                onSubmit={handleSubmit}
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Welcome back
                  </h1>
                  <p className="text-slate-500">
                    Login to your account to continue
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="username" className="text-slate-700 font-medium">
                    Username
                  </FieldLabel>
                  <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </FieldLabel>
                  <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) =>
                          setPassword(e.target.value)
                      }
                      placeholder="••••••••"
                      className="rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                  />
                </Field>

                {error && (
                    <div className="rounded-lg bg-red-50 p-3">
                      <p className="text-sm text-red-600 font-medium">
                        {error}
                      </p>
                    </div>
                )}

                {success && (
                    <div className="rounded-lg bg-green-50 p-3">
                      <p className="text-sm text-green-600 font-medium">
                        {success}
                      </p>
                    </div>
                )}

                <Field>
                  <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Field>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <Field>
                  <Button
                      variant="outline"
                      type="button"
                      className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg flex items-center justify-center gap-2"
                      onClick={() => {
                        window.location.href =
                            "http://localhost:8080/oauth2/authorization/google";
                      }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                </Field>
                <FieldDescription className="text-center text-slate-500">
                  Don&apos;t have an account? <a href="/signup" className="text-blue-600 hover:underline font-medium">Sign up</a>
                </FieldDescription>
              </FieldGroup>
            </form>

            <div className="relative hidden bg-slate-900 md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-slate-900/80" />
              <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Login background"
                  className="absolute inset-0 h-full w-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                   <h2 className="text-3xl font-bold">FoodLink</h2>
                   <p className="mt-2 text-lg text-blue-100">Reducing food waste, one meal at a time.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}