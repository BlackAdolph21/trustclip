import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Film,
  Link2,
  MousePointerClick,
  Play,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

const STEPS = [
  {
    icon: Send,
    title: "Send a link",
    description:
      "Drop your TrustClip link into an email, a text, or a post-purchase page. Setup takes minutes, not sprints.",
  },
  {
    icon: MousePointerClick,
    title: "Customer taps record",
    description:
      "It opens straight in their browser. No app to download, no account to create, no friction to abandon.",
  },
  {
    icon: Film,
    title: "You get the video",
    description:
      "A polished, ready-to-share testimonial lands in your dashboard, captioned and trimmed automatically.",
  },
];

const FEATURES = [
  {
    icon: Link2,
    title: "One link, zero setup",
    description:
      "Share a single URL anywhere: email, SMS, or your checkout flow. No apps or logins for your customers.",
  },
  {
    icon: ShieldCheck,
    title: "Built-in moderation",
    description:
      "Review, approve, and organize every clip before it ever reaches your website or ads.",
  },
  {
    icon: Sparkles,
    title: "Auto captions & trimming",
    description:
      "TrustClip removes dead air, adds captions, and formats clips for social in seconds.",
  },
  {
    icon: Share2,
    title: "Embed anywhere",
    description:
      "Drop testimonials into landing pages, checkout, or ads with a single lightweight snippet.",
  },
  {
    icon: BarChart3,
    title: "Conversion analytics",
    description:
      "See exactly which clips drive signups and sales, then double down on what's working.",
  },
  {
    icon: Clock,
    title: "Under 60 seconds",
    description:
      "The average customer finishes recording in under a minute. Friction is the real churn.",
  },
];

const STATS = [
  { value: "4.6x", label: "more responses than email asks" },
  { value: "92%", label: "recording completion rate" },
  { value: "<60s", label: "average time to record" },
];

export default function Home() {
  return (
    <div className="flex-1 bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              TrustClip
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-50"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-zinc-300 hover:text-zinc-50 sm:inline-flex"
            >
              Log in
            </Button>
            <Button size="sm">Get Started Free</Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300">
              <Sparkles className="size-3.5 text-fuchsia-400" />
              No apps. No logins. Just tap and record.
            </div>

            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Collect Video Testimonials{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-300 bg-clip-text text-transparent">
                With Zero Friction
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-8 text-zinc-400 sm:text-xl">
              Send a link. Your customer taps record. You get a
              high-converting video. No apps or logins required.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full px-8 text-base sm:w-auto">
                Get Started Free
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/15 bg-transparent px-8 text-base text-zinc-100 hover:bg-white/5 sm:w-auto"
                asChild
              >
                <a href="#how-it-works">
                  <Play className="size-4" />
                  See How it Works
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-zinc-500">
              No credit card required &middot; Free forever plan &middot; Setup in 5 minutes
            </p>
          </div>

          <div className="relative mx-auto mt-20 max-w-4xl">
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/50 sm:p-4">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-2 pb-3">
                <span className="size-2.5 rounded-full bg-zinc-700" />
                <span className="size-2.5 rounded-full bg-zinc-700" />
                <span className="size-2.5 rounded-full bg-zinc-700" />
                <span className="ml-3 truncate rounded-md bg-white/5 px-3 py-1 text-xs text-zinc-500">
                  trustclip.co/r/happy-customer-co
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-6 px-6 py-16 sm:py-20">
                <p className="text-sm text-zinc-400">
                  Happy Customer Co. wants to hear from you
                </p>
                <button
                  type="button"
                  className="group relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-red-500/30 transition-transform hover:scale-105"
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40" />
                  <span className="relative size-5 rounded-sm bg-white" />
                </button>
                <p className="text-sm font-medium text-zinc-200">
                  Tap to record your story
                </p>
                <div className="flex items-end gap-1">
                  {[6, 10, 16, 22, 14, 20, 9, 18, 12, 7].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-zinc-700"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -left-6 top-10 hidden w-48 rounded-xl border border-white/10 bg-zinc-900/90 p-4 shadow-xl backdrop-blur sm:block">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="size-4" />
                <span className="text-xs font-medium">Video received</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Captioned &amp; ready to publish
              </p>
            </div>

            <div className="absolute -right-6 bottom-6 hidden w-48 rounded-xl border border-white/10 bg-zinc-900/90 p-4 shadow-xl backdrop-blur sm:block">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                &ldquo;Took me 40 seconds.&rdquo;
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02] px-6 py-12">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Three steps. Zero friction.
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Most testimonial tools lose customers at the sign-up wall.
                TrustClip removes it entirely.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8"
                >
                  <span className="text-sm font-medium text-zinc-600">
                    0{index + 1}
                  </span>
                  <div className="mt-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300">
                    <step.icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-zinc-50">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you need, nothing you don&apos;t
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Built to turn happy customers into your best marketing asset,
                automatically.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-zinc-300">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-zinc-50">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-10 text-center sm:p-14">
              <div className="mb-6 flex justify-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-current" />
                ))}
              </div>
              <p className="text-balance text-2xl font-medium leading-tight text-zinc-100 sm:text-3xl">
                &ldquo;We went from begging customers for reviews to
                collecting a dozen video testimonials a week &mdash; without
                lifting a finger.&rdquo;
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold">
                  MC
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-zinc-100">
                    Maya Chen
                  </p>
                  <p className="text-xs text-zinc-500">
                    Head of Growth, Loopwave
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 sm:pb-32">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent px-8 py-16 text-center sm:px-16">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Stop asking for reviews. Start collecting proof.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
              Your first video testimonial is minutes away. No credit card,
              no commitment.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full px-8 text-base sm:w-auto">
                Get Started Free
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/15 bg-transparent px-8 text-base text-zinc-100 hover:bg-white/5 sm:w-auto"
                asChild
              >
                <a href="#how-it-works">See How it Works</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-sm font-semibold text-zinc-300">
              TrustClip
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} TrustClip. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
