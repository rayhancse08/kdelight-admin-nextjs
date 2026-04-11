"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Layouts/sidebar";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // ✅ USE CONTEXT
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // ✅ protect routes
    if (!user && pathname !== "/login") {
      router.replace("/login");
    }

    if (user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, pathname]);

  return (
    <div className="flex min-h-screen">
      {/* ✅ Sidebar reacts instantly */}
      {user && <Sidebar />}

      <div className="w-full">{children}</div>
    </div>
  );
}