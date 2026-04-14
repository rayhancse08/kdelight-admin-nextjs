import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
// import { Providers } from "./providers";
import { AppShell } from "@/components/AppShell"; // adjust path
import {AuthProvider} from "@/components/AuthProvider";
export const metadata: Metadata = {
  title: {
    template: "Kdelight Admin",
    default: "Kdelight Admin",
  },
  description:
    "Kdelight Admin page",
};

import Providers from "./providers"; // ✅ FIXED

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body>
    <Providers>
      <NextTopLoader color="#5750F1" showSpinner={false} />

      <AuthProvider>
        <AppShell>
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </AppShell>
      </AuthProvider>
    </Providers>
    </body>
    </html>
  );
}