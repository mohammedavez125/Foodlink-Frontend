import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useNavigate } from "@tanstack/react-router"

export function SignupForm({
                             className,
                             ...props
                           }: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [role, setRole] = useState<"DONOR" | "NGO">("DONOR")
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    // Profile fields
    organizationName: "",
    donorType: "INDIVIDUAL",
    ngoName: "",
    registrationNumber: "",
    contactPerson: "",
    phone: "",
    address: {
      country: "India",
      state: "",
      city: "",
      street: "",
      pinCode: 0
    },
    description: ""
  })

  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name.startsWith("address.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: field === "pinCode" ? parseInt(value) || 0 : value
        }
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      const endpoint = role === "DONOR" ? "/auth/signup/donor" : "/auth/signup/ngo"
      
      const payload = {
        username: formData.username,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        [role === "DONOR" ? "donorProfile" : "ngoProfile"]: role === "DONOR" ? {
          donorType: formData.donorType,
          organizationName: formData.organizationName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          address: formData.address,
          description: formData.description
        } : {
          ngoName: formData.ngoName,
          registrationNumber: formData.registrationNumber,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          address: formData.address,
          description: formData.description
        }
      }

      const response = await fetch(
          `http://localhost:8080${endpoint}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Registration failed")
      }

      setSuccess("Account created successfully. Redirecting to login...")
      setTimeout(() => {
        navigate({ to: "/login" })
      }, 2000)

    } catch (err) {
      setError(
          err instanceof Error
              ? err.message
              : "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
                className="p-6 md:p-8"
                onSubmit={handleSubmit}
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Create your account
                  </h1>
                  <p className="text-slate-500">
                    Join our community and start making an impact
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="role" className="text-slate-700 font-medium">I am a</FieldLabel>
                  <Select
                    id="role"
                    value={role}
                    className="rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) => setRole(e.target.value as "DONOR" | "NGO")}
                  >
                    <option value="DONOR">Donor (Restaurant, Hotel, Individual)</option>
                    <option value="NGO">NGO (Food Bank, Charity)</option>
                  </Select>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstname" className="text-slate-700 font-medium">
                      First Name
                    </FieldLabel>
                    <Input
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="rounded-lg border-slate-200"
                        required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastname" className="text-slate-700 font-medium">
                      Last Name
                    </FieldLabel>
                    <Input
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="rounded-lg border-slate-200"
                        required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="username" className="text-slate-700 font-medium">
                    Username
                  </FieldLabel>
                  <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="rounded-lg border-slate-200"
                      required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email" className="text-slate-700 font-medium">
                    Email
                  </FieldLabel>
                  <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="rounded-lg border-slate-200"
                      required
                  />
                </Field>

                {role === "DONOR" ? (
                  <>
                    <Field>
                      <FieldLabel htmlFor="organizationName" className="text-slate-700 font-medium">Organization Name</FieldLabel>
                      <Input
                        id="organizationName"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        className="rounded-lg border-slate-200"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="donorType" className="text-slate-700 font-medium">Donor Type</FieldLabel>
                      <Select
                        id="donorType"
                        name="donorType"
                        value={formData.donorType}
                        className="rounded-lg border-slate-200"
                        onChange={handleChange}
                      >
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="RESTAURANT">Restaurant</option>
                        <option value="HOTEL">Hotel</option>
                        <option value="CATERING_SERVICE">Catering Service</option>
                        <option value="VOLUNTEER_GROUP">Volunteer Group</option>
                      </Select>
                    </Field>
                  </>
                ) : (
                  <>
                    <Field>
                      <FieldLabel htmlFor="ngoName" className="text-slate-700 font-medium">NGO Name</FieldLabel>
                      <Input
                        id="ngoName"
                        name="ngoName"
                        value={formData.ngoName}
                        onChange={handleChange}
                        className="rounded-lg border-slate-200"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="registrationNumber" className="text-slate-700 font-medium">Registration Number</FieldLabel>
                      <Input
                        id="registrationNumber"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="rounded-lg border-slate-200"
                        required
                      />
                    </Field>
                  </>
                )}

                <Field>
                  <FieldLabel htmlFor="contactPerson" className="text-slate-700 font-medium">Contact Person</FieldLabel>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="rounded-lg border-slate-200"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone" className="text-slate-700 font-medium">
                    Phone Number
                  </FieldLabel>
                  <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="rounded-lg border-slate-200"
                      required
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="city" className="text-slate-700 font-medium">City</FieldLabel>
                    <Input
                      id="city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="rounded-lg border-slate-200"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="state" className="text-slate-700 font-medium">State</FieldLabel>
                    <Input
                      id="state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="rounded-lg border-slate-200"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="street" className="text-slate-700 font-medium">Street Address</FieldLabel>
                  <Input
                    id="street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="rounded-lg border-slate-200"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="pinCode" className="text-slate-700 font-medium">PIN Code</FieldLabel>
                  <Input
                    id="pinCode"
                    name="address.pinCode"
                    type="number"
                    value={formData.address.pinCode || ""}
                    onChange={handleChange}
                    className="rounded-lg border-slate-200"
                    required
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password" className="text-slate-700 font-medium">
                      Password
                    </FieldLabel>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="rounded-lg border-slate-200"
                        required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm-password" className="text-slate-700 font-medium">
                      Confirm Password
                    </FieldLabel>
                    <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        className="rounded-lg border-slate-200"
                        required
                    />
                  </Field>
                </div>

                <FieldDescription className="text-slate-500">
                  Password must be at least 8 characters long.
                </FieldDescription>

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
                    {loading
                        ? "Creating Account..."
                        : "Create Account"}
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

                <Field className="flex items-center">
                  <Button
                      variant="outline"
                      type="button"
                      className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg flex items-center justify-center gap-2"
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
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline font-medium">Sign in</a>
                </FieldDescription>
              </FieldGroup>
            </form>

            <div className="relative hidden bg-slate-900 md:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-slate-900/80" />
              <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Signup background"
                  className="absolute inset-0 h-full w-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">
                   <h2 className="text-3xl font-bold">Join FoodLink</h2>
                   <p className="mt-2 text-lg text-green-100">Make a difference in your community today.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
  )
}
