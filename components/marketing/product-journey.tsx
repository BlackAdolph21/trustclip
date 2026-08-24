"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  Film,
  Smartphone,
  Sparkles,
} from "lucide-react";

type RevealProps = {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  onVisible?: () => void;
};

/**
 * Fades and lifts its children into view the first time they enter the
 * viewport. Deliberately hand-rolled with IntersectionObserver rather than a
 * motion library, to keep this section's "alive" feel without adding a new
 * dependency to the project.
 */
function Reveal({ children, delayMs = 0, className, onVisible }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.();
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

const DASHBOARD_ROWS = [
  { name: "Maya Chen", status: "Approved" as const },
  { name: "Jordan Reyes", status: "Approved" as const },
  { name: "Priya Natarajan", status: "Pending" as const },
];

function DashboardShowcaseCard() {
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleVisible = () => {
    // Let the card's own fade/lift settle first, then have the toast slide
    // in as a small "moment" rather than everything appearing at once.
    toastTimeoutRef.current = setTimeout(() => setShowToast(true), 900);
  };

  return (
    <Reveal className="h-full lg:col-span-2 lg:row-span-2" onVisible={handleVisible}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent p-6 shadow-xl shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/30 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-indigo-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <Sparkles className="size-3.5 text-indigo-400" />
            Your dashboard, always current
          </span>
        </div>

        <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
          Every testimonial, ready the moment it&apos;s recorded.
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
          No refreshing, no digging through email. Submissions appear in your
          inbox in real time, already sorted and ready to approve.
        </p>

        <div className="relative mt-8 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="ml-2 text-xs text-slate-500">Testimonials</span>
          </div>

          <div className="flex flex-col gap-2 p-3">
            {DASHBOARD_ROWS.map((row) => (
              <div
                key={row.name}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-500">
                  <Film className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{row.name}</p>
                  <p className="text-xs text-slate-500">Just now</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    row.status === "Approved"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-amber-500/15 text-amber-300"
                  }`}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`absolute inset-x-3 bottom-3 flex items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2.5 shadow-lg shadow-black/30 backdrop-blur-md transition-all duration-500 ${
              showToast
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-3 opacity-0"
            }`}
          >
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
            <p className="text-xs font-medium text-emerald-200">
              New submission just landed
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function ShowcaseCard({
  icon: Icon,
  title,
  description,
  delayMs,
}: {
  icon: typeof Smartphone;
  title: string;
  description: string;
  delayMs: number;
}) {
  return (
    <Reveal delayMs={delayMs} className="h-full">
      <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:shadow-xl hover:shadow-indigo-500/10 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-indigo-500/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 text-indigo-300 transition-transform duration-300 group-hover:scale-110">
          <Icon className="size-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-50">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </Reveal>
  );
}

export function ProductJourney() {
  return (
    <section className="border-b border-white/10 bg-white/[0.02] px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-slate-300">
            <Sparkles className="size-3.5 text-indigo-400" />
            Inside the product
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built to disappear, until the moment it matters.
          </h2>
          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            No portals to log into, no files to chase down. Just a fast,
            beautiful experience on both ends of the link.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <DashboardShowcaseCard />
          <ShowcaseCard
            icon={Smartphone}
            title="No apps. No downloads."
            description="Everything happens right in the browser your client already has open, on any device."
            delayMs={120}
          />
          <ShowcaseCard
            icon={Download}
            title="You own every file"
            description="Export the raw .mp4 anytime and use it in ads, socials, or your website — no watermarks."
            delayMs={240}
          />
        </div>

        <Reveal
          delayMs={200}
          className="mt-5 flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-4 text-center sm:flex-row sm:gap-4"
        >
          <Clock3 className="size-4 text-indigo-400" />
          <p className="text-sm text-slate-400">
            Most clients finish recording in under a minute, from tap to
            submit.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
