"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, MessageSquare, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and a message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: null }));
        throw new Error(error || "Something went wrong. Please try again.");
      }

      setIsSubmitted(true);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(description);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-2xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-slate-300">
            <Sparkles className="size-3.5 text-indigo-400" />
            We&apos;re listening
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Have an idea? Tell us anything.
          </h2>
          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            Feature request, a bug, or just a random thought about TrustClip
            &mdash; we read every message and would genuinely love to hear
            from you.
          </p>
        </div>

        <Card className="animate-in fade-in-0 mt-10 rounded-3xl border border-white/10 bg-white/[0.03] shadow-none ring-0 duration-300 [--card-spacing:--spacing(8)]">
          <CardContent>
            {isSubmitted ? (
              <div className="animate-in fade-in-0 zoom-in-95 flex flex-col items-center gap-4 py-6 text-center duration-300">
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-50">
                    Thank you!
                  </CardTitle>
                  <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    Your message is on its way to our team. We appreciate you
                    taking the time to share it.
                  </CardDescription>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-name" className="text-slate-300">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="feedback-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="pl-9 text-slate-50 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-email" className="text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="feedback-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@business.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="pl-9 text-slate-50 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-message" className="text-slate-300">
                    Message
                  </Label>
                  <div className="relative">
                    <MessageSquare className="pointer-events-none absolute left-3 top-3 size-4 text-slate-500" />
                    <Textarea
                      id="feedback-message"
                      placeholder="Tell us anything&hellip; a feature you'd love, something confusing, or just a thought."
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      required
                      rows={5}
                      className="min-h-32 pl-9 text-slate-50 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-2 w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending&hellip;
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
