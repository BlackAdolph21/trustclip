"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  CircleAlert,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  ShieldCheck,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

type AuthView = "login" | "signup" | "forgot_password";

const inputClassName =
  "border-white/10 bg-white/5 pl-9 text-slate-50 placeholder:text-slate-500 focus-visible:ring-indigo-500/30";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [view, setView] = useState<AuthView>(
    searchParams.get("tab") === "signup" ? "signup" : "login"
  );
  const [signUpComplete, setSignUpComplete] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const switchView = (nextView: AuthView) => {
    setView(nextView);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (view === "forgot_password") {
      if (!email) {
        setError("Please enter your email address.");
        return;
      }

      setIsLoading(true);

      try {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
      } catch (resetError) {
        console.error("Failed to request password reset:", resetError);
      } finally {
        // Always show the same message, whether or not the email exists,
        // so we never reveal account existence to a potential attacker.
        setResetEmailSent(true);
        setIsLoading(false);
      }

      return;
    }

    if (view === "signup") {
      if (!firstName || !lastName || !businessName || !email || !password || !confirmPassword) {
        setError("Please fill in every field to create your account.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setIsLoading(true);

      try {
        const { data: existingBusiness } = await supabase
          .from("profiles")
          .select("id")
          .ilike("business_name", businessName)
          .maybeSingle();

        if (existingBusiness) {
          setError("That business name is already taken. Please choose another.");
          return;
        }

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
          if (signUpError.message.toLowerCase().includes("already registered")) {
            setError("This email address is already in use. Please log in.");
          } else {
            setError(signUpError.message);
          }
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
        if (signInError.message.toLowerCase().includes("invalid login credentials")) {
          setError("Wrong email address or password. Please try again.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong while signing in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const backToLogin = () => {
    setSignUpComplete(false);
    setResetEmailSent(false);
    switchView("login");
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

      <Card className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] shadow-none ring-0 [--card-spacing:--spacing(10)]">
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
                onClick={backToLogin}
              >
                Back to Log In
              </Button>
            </div>
          ) : resetEmailSent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-50">
                  Check your inbox
                </CardTitle>
                <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-6 text-emerald-400">
                  If this email address exists in our system, a password
                  reset link has been sent to your inbox.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="mt-2 w-full border-white/15 bg-transparent text-slate-100 hover:bg-white/5"
                onClick={backToLogin}
              >
                Back to Log In
              </Button>
            </div>
          ) : (
            <>
              {view !== "forgot_password" && (
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() => switchView("login")}
                    className={cn(
                      "rounded-lg py-1.5 text-sm font-medium transition-colors",
                      view === "login"
                        ? "bg-white/10 text-slate-50"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => switchView("signup")}
                    className={cn(
                      "rounded-lg py-1.5 text-sm font-medium transition-colors",
                      view === "signup"
                        ? "bg-white/10 text-slate-50"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <div className="text-center">
                <CardTitle className="text-xl font-semibold text-slate-50">
                  {view === "signup"
                    ? "Create your account"
                    : view === "forgot_password"
                      ? "Reset your password"
                      : "Welcome back"}
                </CardTitle>
                <CardDescription className="mt-1.5 text-sm text-slate-400">
                  {view === "signup"
                    ? "Set up your business to start collecting video testimonials."
                    : view === "forgot_password"
                      ? "Enter your email and we'll send you a link to reset your password."
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
                {view === "signup" && (
                  <div className="flex w-full flex-col gap-4 sm:flex-row">
                    <div className="w-full flex-1 space-y-2">
                      <Label htmlFor="firstName" className="text-slate-300">
                        First Name
                      </Label>
                      <div className="relative w-full">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                        <Input
                          id="firstName"
                          type="text"
                          autoComplete="given-name"
                          placeholder="Jane"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          required
                          className={cn(inputClassName, "w-full")}
                        />
                      </div>
                    </div>
                    <div className="w-full flex-1 space-y-2">
                      <Label htmlFor="lastName" className="text-slate-300">
                        Last Name
                      </Label>
                      <div className="relative w-full">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                        <Input
                          id="lastName"
                          type="text"
                          autoComplete="family-name"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                          required
                          className={cn(inputClassName, "w-full")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {view === "signup" && (
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
                    {view === "signup" ? "Business Email" : "Email"}
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

                {view !== "forgot_password" && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={view === "signup" ? "new-password" : "current-password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className={cn(inputClassName, "pr-10")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {view === "signup" && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirmPassword" className="text-slate-300">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className={cn(inputClassName, "pr-10")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="mt-2 w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="size-4 animate-spin" />}
                  {view === "signup"
                    ? "Create Account"
                    : view === "forgot_password"
                      ? "Send Reset Link"
                      : "Sign In"}
                </Button>

                {view === "login" && (
                  <button
                    type="button"
                    onClick={() => switchView("forgot_password")}
                    className="text-center text-sm font-medium text-slate-400 hover:text-slate-200"
                  >
                    Forgot password?
                  </button>
                )}
              </form>

              <p className="text-center text-sm text-slate-500">
                {view === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchView("login")}
                      className="font-medium text-slate-300 hover:text-slate-50"
                    >
                      Log in
                    </button>
                  </>
                ) : view === "forgot_password" ? (
                  <>
                    Remembered your password?{" "}
                    <button
                      type="button"
                      onClick={() => switchView("login")}
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
                      onClick={() => switchView("signup")}
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
