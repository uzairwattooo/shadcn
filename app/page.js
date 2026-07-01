import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Package,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center rounded-full border bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <BadgeCheck className="mr-2 h-4 w-4 text-cyan-500" />
            Stripe Connect Marketplace
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Sell products. Buy securely. Payments split automatically.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-slate-600">
            A simple marketplace where sellers can add products, customers can
            buy online, and payments are automatically divided between seller
            and platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
              <Link href="/auth/signup">
                Start Selling <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/customer">Shop Products</Link>
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="space-y-5 p-6">
            <div className="rounded-xl bg-slate-950 p-6 text-white">
              <p className="text-sm text-slate-300">Payment Example</p>
              <h2 className="mt-2 text-3xl font-bold">$200.00</h2>
            </div>

            <div className="grid gap-4">
              <InfoRow title="Customer Pays" value="$200" />
              <InfoRow title="Platform Fee 10%" value="$20" />
              <InfoRow title="Seller Receives" value="$180" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-950">
            Built for sellers and customers
          </h2>
          <p className="mt-2 text-slate-600">
            One platform with separate experience for every role.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={Store}
            title="For Sellers"
            text="Connect Stripe, add products, manage listings, and receive payments directly."
          />

          <FeatureCard
            icon={Users}
            title="For Customers"
            text="Browse products, fill checkout details, and pay securely using Stripe."
          />

          <FeatureCard
            icon={CreditCard}
            title="For Platform"
            text="Automatically collect 10% commission from every successful payment."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-2xl bg-slate-950 p-8 text-white md:p-12">
          <h2 className="text-3xl font-bold">How it works</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              title="Seller adds product"
              text="Seller connects Stripe and uploads products with image, price and description."
            />

            <Step
              number="02"
              title="Customer buys"
              text="Customer opens product, fills delivery details and enters payment info securely."
            />

            <Step
              number="03"
              title="Payment splits"
              text="Stripe sends 10% to platform and remaining amount to seller account."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-start gap-4 p-6">
              <ShieldCheck className="h-10 w-10 text-cyan-500" />
              <div>
                <h3 className="text-xl font-semibold">Secure Payments</h3>
                <p className="mt-2 text-slate-600">
                  Card details are handled securely through Stripe Elements, not
                  stored on our server.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-start gap-4 p-6">
              <Package className="h-10 w-10 text-cyan-500" />
              <div>
                <h3 className="text-xl font-semibold">Product Management</h3>
                <p className="mt-2 text-slate-600">
                  Sellers can add, update and delete products with image upload
                  support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function InfoRow({ title, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
      <span className="text-sm text-slate-600">{title}</span>
      <span className="font-bold text-slate-950">{value}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <Card className="border-0 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
        <p className="mt-2 text-slate-600">{text}</p>
      </CardContent>
    </Card>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-bold text-cyan-400">{number}</p>
      <h3 className="mt-3 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{text}</p>
    </div>
  );
}