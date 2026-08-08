"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  CircleAlert,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const inputClassName =
  "border-white/10 bg-white/5 pl-9 text-slate-50 placeholder:text-slate-500 focus-visible:ring-indigo-500/30";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(searchParams.get("tab") === "signup");
  const [signUpComplete, setSignUpComplete] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchMode = (nextIsSignUp: boolean) => {
    setIsSignUp(nextIsSignUp);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isSignUp) {
      if (!firstName || !lastName || !businessName || !email || !password) {
        setError("Please fill in every field to create your account.");
        return;
      }

      setIsLoading(true);

      try {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              business_name: businessName,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        setSignUpComplete(true);
      } catch {
        setError("Something went wrong while signing up. Please try again.");
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong while signing in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-16 text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <Link href="/" className="mb-8 block text-center">
        <span className="text-xl font-bold text-white tracking-tight">TrustClip</span>
      </Link>

      <Card className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] shadow-none ring-0">
        <CardContent className="flex flex-col gap-6">
          {signUpComplete ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
                <MailCheck className="size-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-50">
                  Check your inbox
                </CardTitle>
                <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  We&apos;ve sent a verification link to{" "}
                  <span className="font-medium text-slate-300">{email}</span>.
                  Verify your email to activate your account before signing
                  in.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="mt-2 w-full border-white/15 bg-transparent text-slate-100 hover:bg-white/5"
                onClick={() => {
                  setSignUpComplete(false);
                  switchMode(false);
                }}
              >
                Back to Log In
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className={cn(
                    "rounded-lg py-1.5 text-sm font-medium transition-colors",
                    !isSignUp
                      ? "bg-white/10 text-slate-50"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className={cn(
                    "rounded-lg py-1.5 text-sm font-medium transition-colors",
                    isSignUp
                      ? "bg-white/10 text-slate-50"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Sign Up
                </button>
              </div>

              <div className="text-center">
                <CardTitle className="text-xl font-semibold text-slate-50">
                  {isSignUp ? "Create your account" : "Welcome back"}
                </CardTitle>
                <CardDescription className="mt-1.5 text-sm text-slate-400">
                  {isSignUp
                    ? "Set up your business to start collecting video testimonials."
                    : "Sign in to view and manage your collected testimonials."}
                </CardDescription>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="firstName" className="text-slate-300">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                        <Input
                          id="firstName"
                          type="text"
                          autoComplete="given-name"
                          placeholder="Jane"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          className={inputClassName}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="lastName" className="text-slate-300">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                        <Input
                          id="lastName"
                          type="text"
                          autoComplete="family-name"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                          className={inputClassName}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="businessName" className="text-slate-300">
                      Business Name
                    </Label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        id="businessName"
                        type="text"
                        autoComplete="organization"
                        placeholder="Acme Co."
                        value={businessName}
                        onChange={(event) => setBusinessName(event.target.value)}
                        className={inputClassName}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-slate-300">
                    {isSignUp ? "Business Email" : "Email"}
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@business.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-2 w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="size-4 animate-spin" />}
                  {isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode(false)}
                      className="font-medium text-slate-300 hover:text-slate-50"
                    >
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode(true)}
                      className="font-medium text-slate-300 hover:text-slate-50"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
