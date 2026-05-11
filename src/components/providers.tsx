"use client";

import type { ReactNode } from "react";
import { AuthSessionProvider } from "@/lib/auth-session";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
