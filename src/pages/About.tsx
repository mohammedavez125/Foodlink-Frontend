import { Link } from "@tanstack/react-router"
import { ArrowRight, HandHeart, MapPinned, ShieldCheck, Truck, UsersRound, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const workflow = [
  {
    title: "Donors publish surplus",
    description: "Restaurants, caterers, hotels, and individuals list safe surplus food with pickup and expiry details.",
    icon: Utensils,
  },
  {
    title: "NGOs accept nearby food",
    description: "Verified NGOs review available donations, preview collection routes, and reserve food they can collect.",
    icon: MapPinned,
  },
  {
    title: "Every handoff is tracked",
    description: "Dispatch and received states keep donors and NGOs aligned until the donation is delivered.",
    icon: Truck,
  },
]

const values = [
  "Food safety first",
  "Fast local matching",
  "Transparent logistics",
  "Community accountability",
]

function About() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="container mx-auto grid gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div className="space-y-6">
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700" variant="outline">
              FoodLink operations
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
                A practical network for moving surplus food to people who need it.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                FoodLink connects donors and NGOs through clear listings, pickup coordination, route visibility, and
                status updates that make each donation easier to manage.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup">
                <Button className="bg-emerald-700 hover:bg-emerald-800" size="lg">
                  Join FoodLink
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/home">
                <Button size="lg" variant="outline">
                  Back to home
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-emerald-100 bg-emerald-950 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <HandHeart className="size-6 text-emerald-300" />
                Why it matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-emerald-50">
                Surplus food loses value quickly. FoodLink keeps the workflow simple enough for busy donors and precise
                enough for NGOs coordinating real pickup windows.
              </p>
              <Separator className="bg-white/15" />
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-3xl font-bold text-emerald-300">3</p>
                  <p className="text-sm text-emerald-50/80">workflow roles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-300">24/7</p>
                  <p className="text-sm text-emerald-50/80">listing access</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-300">Live</p>
                  <p className="text-sm text-emerald-50/80">status tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto space-y-10 px-6 py-14">
        <div className="max-w-2xl space-y-3">
          <Badge variant="secondary">How FoodLink works</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">Built around the donation handoff</h2>
          <p className="text-slate-600">
            The platform focuses on the steps teams repeat every day: listing, accepting, dispatching, receiving, and
            closing the loop.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {workflow.map((item) => {
            const Icon = item.icon

            return (
              <Card className="bg-white" key={item.title}>
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600">{item.description}</CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-700" />
                Operating principles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {values.map((value) => (
                <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700" key={value}>
                  {value}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersRound className="size-5 text-emerald-700" />
                Who uses FoodLink
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="font-semibold text-slate-950">Donors</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Publish food, manage pickup details, and mark accepted donations as dispatched for collection.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-semibold text-slate-950">NGOs</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Browse available donations, preview routes, accept food, and mark items as received after handoff.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

export default About
