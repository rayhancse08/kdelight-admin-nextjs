"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { useAuth } from "@/components/AuthProvider";

type User = {
  username: string;
  email: string;
};

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser(null);
    }
  }, []);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // ✅ updates state globally
    router.replace("/login");
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded outline-none">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          {/* ✅ SHOW USER OR LOGIN */}
          {user ? (
            <figcaption className="flex items-center gap-1 font-medium text-dark">
              <span>{user.username}</span>

              <ChevronUpIcon
                className={cn(
                  "rotate-180 transition-transform",
                  isOpen && "rotate-0"
                )}
              />
            </figcaption>
          ) : (
            <span className="flex items-center gap-2 text-sm font-medium text-blue-600">
              <UserIcon />
              Login
            </span>
          )}
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border bg-white shadow-md min-w-[230px]"
        align="end"
      >
        {/* ✅ Logged-in view */}
        {user ? (
          <>
            <div className="px-5 py-3">
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>

            <hr />

            <div className="p-2">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
              >
                <UserIcon />
                Profile
              </Link>

              <Link
                href="/pages/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
              >
                <SettingsIcon />
                Settings
              </Link>
            </div>

            <hr />

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
              >
                <LogOutIcon />
                Logout
              </button>
            </div>
          </>
        ) : (
          /* ✅ Logged-out view */
          <div className="p-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
            >
              <UserIcon />
              Login
            </Link>
          </div>
        )}
      </DropdownContent>
    </Dropdown>
  );
}