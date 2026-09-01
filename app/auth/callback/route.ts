import { NextResponse } from 'next/server';
import type { EmailOtpType, User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/sendWelcomeEmail';

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// Fires the founder's one-time welcome email right after a user's first
// successful email verification. This is intentionally fire-and-forget-safe
// (wrapped in try/catch) so an email/Resend hiccup can never break the
// surrounding auth redirect.
async function maybeSendWelcomeEmail(supabase: SupabaseServerClient, user: User | null) {
  if (!user?.email || user.user_metadata?.welcome_email_sent) {
    return;
  }

  try {
    const firstName = user.user_metadata?.first_name ?? user.user_metadata?.full_name ?? null;
    await sendWelcomeEmail(user.email, firstName);

    // Marked on user_metadata (rather than a new `profiles` column) so this
    // requires no database migration. Best-effort: if this update fails,
    // we'd rather risk a duplicate welcome email later than fail the flow.
    await supabase.auth.updateUser({
      data: { welcome_email_sent: true },
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';

  // Password reset links are exchanged through this same callback shape, so
  // this guard keeps the welcome email scoped to genuine signup
  // verifications only.
  const isPasswordRecovery = type === 'recovery' || next === '/reset-password';

  const supabase = await createClient();

  // Flow 1: Handle standard PKCE Auth Codes (if present)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (!isPasswordRecovery) {
        await maybeSendWelcomeEmail(supabase, data.user);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Flow 2: Handle Custom Email Links using verifyOtp (Token Hashes)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as EmailOtpType,
    });
    if (!error) {
      if (!isPasswordRecovery) {
        await maybeSendWelcomeEmail(supabase, data.user);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If both fail or are missing, redirect to login with an error
  return NextResponse.redirect(`${origin}/login?error=Invalid_or_expired_link`);
}
