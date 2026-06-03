"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthField,
  AuthFooterText,
  OnboardingShell,
  PrimaryButton,
  RememberCheckLabel,
  RememberRow,
} from "@/components/onboarding-shell";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { createSessionFromAuthResponse, useAuthSession } from "@/lib/auth-session";

export default function SignInPage() {
  const router = useRouter();
  const { setSession } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDisabled = !email.trim() || !password.trim() || isSubmitting;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await apiRequest(endpoints.admin.login, {
        method: "POST",
        body: {
          email: email.trim().toLowerCase(),
          password,
        },
      });

      const nextSession =
        createSessionFromAuthResponse(response, {
          user: {
            email: email.trim().toLowerCase(),
          },
        }) ??
        createSessionFromAuthResponse(
          {},
          {
            user: {
              email: email.trim().toLowerCase(),
            },
          },
        );

        console.log("LOGIN RESPONSE", response);

      setSession(nextSession);
      router.replace("/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingShell
      heroTitle={
        <>
          <span className="block">Welcome to BMI LMS</span>
          <span className="block">Super- Admin Platform</span>
        </>
      }
      panelTitle="Welcome Back"
      panelDescription="Please sign in safely. Protect your login information."
    >
      <div className="space-y-8">
        <div className="space-y-7">
          <AuthField
            label="Super Admin Email"
            type="email"
            placeholder="admin@school.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <AuthField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </div>

        <RememberRow
          left={<RememberCheckLabel>Remember Me</RememberCheckLabel>}
          right={
            <Link href="/auth/forgot-password" className="font-medium text-[#173257]">
              Forgot Password?
            </Link>
          }
        />

        {errorMessage ? <p className="text-[14px] font-medium text-[#cf3f4f]">{errorMessage}</p> : null}

        <PrimaryButton onClick={handleSubmit} disabled={submitDisabled}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </PrimaryButton>

        <AuthFooterText
          text="Don't have an account?"
          action={
            <Link href="/auth" className="font-bold text-[#4d8d63]">
              Sign up
            </Link>
          }
        />
      </div>
    </OnboardingShell>
  );
}
