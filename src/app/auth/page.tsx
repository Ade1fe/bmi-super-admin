"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  AuthField,
  AuthFooterText,
  OnboardingShell,
  PrimaryButton,
} from "@/components/onboarding-shell";
import { apiRequest, endpoints } from "@/lib/endpoints";

export default function AuthSignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDisabled =
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmPassword.trim() ||
    isSubmitting;

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await apiRequest(endpoints.admin.register, {
        method: "POST",
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
        },
      });

      router.push(`/auth/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create admin account.");
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
      panelTitle="Super Admin Platform"
    >
      <div className="space-y-8">
        <div className="grid gap-7 sm:grid-cols-2">
          <AuthField
            label="First Name"
            placeholder="Ibrahim"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            autoComplete="given-name"
          />
          <AuthField
            label="Last Name"
            placeholder="Ibrahim"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            autoComplete="family-name"
          />
          <div className="sm:col-span-2">
            <AuthField
              label="Super Admin Email"
              type="email"
              placeholder="admin@school.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="sm:col-span-2">
            <AuthField
              label="Password"
              type="password"
              placeholder="Enter a secure password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="sm:col-span-2">
            <AuthField
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        {errorMessage ? <p className="text-[14px] font-medium text-[#cf3f4f]">{errorMessage}</p> : null}

        <PrimaryButton onClick={handleSubmit} disabled={submitDisabled}>
          <span className="inline-flex items-center gap-3">
            {isSubmitting ? "Creating Account..." : "Next"}
            <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
          </span>
        </PrimaryButton>

        <AuthFooterText
          text="Already have an account?"
          action={
            <Link href="/auth/sign-in" className="font-bold text-[#4d8d63]">
              Sign in
            </Link>
          }
        />
      </div>
    </OnboardingShell>
  );
}
