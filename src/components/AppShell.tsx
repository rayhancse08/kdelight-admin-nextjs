"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = ["/login"];
  const isPublic = publicRoutes.includes(pathname);

  useEffect(() => {
    if (loading) return;

    if (!user && !isPublic) {
      router.replace("/login");
    }

    if (user && isPublic) {
      router.replace("/dashboard"); // ✅ use correct route
    }
  }, [user, loading, pathname, router]);

  // ✅ prevent flicker / wrong UI render
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!user && !isPublic) return null;
  if (user && isPublic) return null;

  return (
    <div className="flex min-h-screen">
      {user && <Sidebar />}

      <div className="w-full">
        {user && <Header />} {/* ✅ moved here */}

        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}