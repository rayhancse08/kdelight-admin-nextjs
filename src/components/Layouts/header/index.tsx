"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";

import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,250,252,0.78))] px-4 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-2xl md:px-5 2xl:px-10">
      <div className="flex items-center justify-between gap-3 rounded-[28px] border border-white/60 bg-white/70 px-3 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-xl md:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 lg:hidden"
          >
            <MenuIcon />
            <span className="sr-only">Toggle Sidebar</span>
          </button>

          {isMobile && (
            <Link
              href="/"
              className="flex shrink-0 items-center rounded-2xl border border-white/70 bg-white/80 p-2 shadow-sm min-[375px]:ml-1 max-[430px]:hidden"
            >
              <Image
                src="/images/logo/logo-icon.svg"
                width={32}
                height={32}
                alt=""
                role="presentation"
              />
            </Link>
          )}

          <div className="hidden min-w-0 xl:block">
            <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="truncate text-sm text-slate-500">
              Kdelight Admin Dashboard Solution
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-3">
          <div className="relative hidden w-full max-w-[360px] sm:block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon className="size-5" />
            </span>

            <input
              type="search"
              placeholder="Search anything..."
              className="h-12 w-full rounded-2xl border border-slate-200/80 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/75 p-1.5 shadow-sm backdrop-blur-md">
            <div className="rounded-xl transition-all hover:bg-sky-50">
              <ThemeToggleSwitch />
            </div>

            <div className="rounded-xl transition-all hover:bg-sky-50">
              <Notification />
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/60 bg-white/80 p-1 shadow-sm backdrop-blur-md">
            <UserInfo />
          </div>
        </div>
      </div>
    </header>
  );
}
