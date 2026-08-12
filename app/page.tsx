import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Download,
  Film,
  LayoutDashboard,
  Link2,
  MousePointerClick,
  Play,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

const TRUSTED_BY = ["Northwind", "Vantage Legal", "Bramwell & Co.", "Solace Health", "Ledgerline", "Atlas Realty"];

const STEPS = [
  {
    icon: Send,
    title: "Send a link",
    description:
      "Drop your custom TrustClip link into an email, a text message, or your offboarding flow.",
  },
  {
    icon: MousePointerClick,
    title: "Client taps record",
    description:
      "The link opens instantly in their mobile browser. No apps to download, and no account creation required.",
  },
  {
    icon: Film,
    title: "You get the video",
    description:
      "As soon as they finish, the file lands in your dashboard, ready to download and share.",
  },
];

const FEATURES = [
  {
    icon: Link2,
    title: "One link, zero setup",
    description: "Share a single, permanent URL anywhere. It just works.",
  },
  {
    icon: Smartphone,
    title: "Mobile-optimized",
    description:
      "Designed to look native and beautiful on both iOS and Android browsers.",
  },
  {
    icon: Clock,
    title: "Time-boxed feedback",
    description:
      "We cap recordings at 60 seconds so clients don't ramble, giving you concise, impactful quotes.",
  },
  {
    icon: Bell,
    title: "Automatic delivery",
    description:
      "Get an instant email notification the second a client submits a new video.",
  },
  {
    icon: Download,
    title: "Own your content",
    description:
      "Download the raw .mp4 files in one click to use in your ads, social media, or website.",
  },
  {
    icon: LayoutDashboard,
    title: "Dead-simple dashboard",
    description:
      "No confusing timelines or editing suites. Just a clean inbox of your client success stories.",
  },
];

const STATS = [
  { value: "4.6x", label: "more responses than email requests" },
  { value: "92%", label: "recording completion rate" },
  { value: "<60s", label: "average time for clients to record" },
];

export default function Home() {
  return (
    <div className="flex-1 bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute left-1/2 top-[-12%] h-[38rem] w-[68rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[32rem] w-[32rem] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">TrustClip</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 transition-colors hover:text-slate-50"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-slate-300 hover:bg-white/5 hover:text-slate-50 sm:inline-flex"
              asChild
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login?tab=signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
              <Sparkles className="size-3.5 text-indigo-400" />
              No apps. No logins. Just tap and record.
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Collect Video Testimonials{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                With Zero Friction
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-slate-400 sm:text-lg sm:leading-8 lg:text-xl">
              Send a secure link. Your client taps record. You receive a
              high-converting video. The easiest way to gather social proof
              without inconveniencing your clients.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button size="lg" className="w-full px-8 text-base sm:w-auto" asChild>
                <Link href="/login?tab=signup">
                  Get Started Free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/15 bg-transparent px-8 text-base text-slate-100 hover:bg-white/5 sm:w-auto"
                asChild
              >
                <a href="#how-it-works">
                  <Play className="size-4" />
                  See How it Works
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              No credit card required &middot; Free forever plan &middot; Setup in 5 minutes
            </p>
          </div>

          <div className="relative mx-auto mt-16 max-w-4xl sm:mt-20">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-500/30 via-blue-500/10 to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/60 backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.08] to-transparent" />

              <div className="relative flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="ml-3 truncate rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  trustclip.co/happy-customer-co
                </span>
              </div>

              <div className="relative flex flex-col items-center justify-center gap-7 px-6 py-16 sm:py-24">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-slate-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Happy Customer Co. wants to hear from you
                </span>

                <Link
                  href="/login"
                  aria-label="Try recording a testimonial"
                  className="group relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-xl shadow-indigo-500/40 transition-transform duration-300 hover:scale-105"
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/40" />
                  <span className="absolute -inset-3 animate-pulse rounded-full border border-indigo-400/20" />
                  <span className="relative size-6 rounded-md bg-white shadow-inner" />
                </Link>

                <p className="text-sm font-medium text-slate-200">
                  Tap to record your story
                </p>
                <div className="flex items-end gap-1">
                  {[6, 10, 16, 22, 14, 20, 9, 18, 12, 7].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-white/15"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -left-4 top-8 hidden w-48 rounded-xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl sm:-left-6 sm:block">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="size-4" />
                <span className="text-xs font-medium">Video received</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Captioned &amp; ready to publish
              </p>
            </div>

            <div className="absolute -right-4 bottom-4 hidden w-48 rounded-xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl sm:-right-6 sm:bottom-6 sm:block">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                &ldquo;Took me 40 seconds.&rdquo;
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Trusted by service businesses and agencies everywhere
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70 grayscale">
              {TRUSTED_BY.map((name) => (
                <span
                  key={name}
                  className="text-sm font-semibold tracking-tight text-slate-400"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-white/[0.02] px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="outline"
                className="mx-auto mb-4 border-white/10 bg-white/5 text-slate-400"
              >
                How it works
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Three steps. Zero friction.
              </h2>
              <p className="mt-4 text-base text-slate-400 sm:text-lg">
                Most testimonial tools lose clients at the sign-up wall.
                TrustClip removes it entirely so you get higher response
                rates.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3 md:gap-8">
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:bg-white/[0.05] sm:p-8"
                >
                  <span className="text-sm font-medium text-slate-600">
                    0{index + 1}
                  </span>
                  <div className="mt-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 text-indigo-300">
                    <step.icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-50">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-white/10 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="outline"
                className="mx-auto mb-4 border-white/10 bg-white/5 text-slate-400"
              >
                Built for busy teams
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you need, nothing you don&apos;t.
              </h2>
              <p className="mt-4 text-base text-slate-400 sm:text-lg">
                Built to turn happy clients into your best marketing asset,
                automatically.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-slate-300">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-50">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="border-t border-white/10 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 text-center sm:p-14">
              <div className="mb-6 flex justify-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-current" />
                ))}
              </div>
              <p className="text-balance text-xl font-medium leading-snug text-slate-100 sm:text-2xl sm:leading-tight lg:text-3xl">
                &ldquo;We went from asking clients for reviews and getting
                ignored, to collecting a dozen video testimonials a
                month&mdash;without lifting a finger. The lack of friction is
                incredible.&rdquo;
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-semibold">
                  MC
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-100">
                    Maya Chen
                  </p>
                  <p className="text-xs text-slate-500">
                    Founder, Loopwave
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:pb-32">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent px-6 py-14 text-center sm:px-16 sm:py-16">
            <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-slate-300">
              <ShieldCheck className="size-3.5 text-indigo-400" />
              Trusted, secure, and built to scale with your business
            </div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Stop asking for reviews. Start collecting proof.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 sm:text-lg">
              Your first video testimonial is minutes away. No credit card,
              no commitment.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button size="lg" className="w-full px-8 text-base sm:w-auto" asChild>
                <Link href="/login?tab=signup">
                  Get Started Free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/15 bg-transparent px-8 text-base text-slate-100 hover:bg-white/5 sm:w-auto"
                asChild
              >
                <a href="#how-it-works">See How it Works</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:gap-12">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
            <div className="max-w-xs">
              <span className="text-xl font-bold text-white tracking-tight">TrustClip</span>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                The fastest way for service businesses to collect and own
                their video testimonials.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product
                </p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-slate-50"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Account
                </p>
                <div className="mt-3 flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    className="text-sm text-slate-400 transition-colors hover:text-slate-50"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/login?tab=signup"
                    className="text-sm text-slate-400 transition-colors hover:text-slate-50"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} TrustClip. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-slate-600">
              <ShieldCheck className="size-3.5" />
              Your data is encrypted and never sold.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
