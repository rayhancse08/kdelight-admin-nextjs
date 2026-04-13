"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Layouts/sidebar";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // ✅ WAIT

    if (!user && pathname !== "/login") {
      router.replace("/login");
    }

    if (user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, loading, pathname]);

  // ✅ prevent flicker
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {user && <Sidebar />}
      <div className="w-full">{children}</div>
    </div>
  );
}