"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    const activeParent = NAV_DATA.flatMap((section) => section.items).find((item) =>
      item.items?.some((subItem) => subItem.url === pathname)
    );

    if (activeParent) {
      setExpandedItems((prev) =>
        prev.includes(activeParent.title) ? prev : [activeParent.title]
      );
    }
  }, [pathname]);

  return (
    <>
      {isMobile && isOpen && (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "overflow-hidden border-r border-white/40 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(241,245,249,0.92)_40%,_rgba(226,232,240,0.9)_100%)] shadow-[0_20px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl transition-all duration-300",
          isMobile
            ? "fixed inset-y-0 left-0 z-50 max-w-[340px]"
            : "sticky top-0 h-screen max-w-[310px]",
          isOpen ? "w-full translate-x-0" : "w-0 -translate-x-3"
        )}
      >
        <div className="relative flex h-full flex-col px-5 py-5">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute left-[-40px] top-[-30px] h-36 w-36 rounded-full bg-cyan-200/40 blur-3xl" />
            <div className="absolute bottom-20 right-[-50px] h-44 w-44 rounded-full bg-blue-300/30 blur-3xl" />
          </div>

          <div className="relative rounded-[30px] border border-white/60 bg-white/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                className="transition-transform duration-200 hover:scale-[1.02]"
                onClick={() => isMobile && toggleSidebar()}
              >
                <Logo />
              </Link>

              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="inline-flex size-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-slate-950"
                >
                  <ArrowLeftIcon className="size-6" />
                </button>
              )}
            </div>
          </div>

          <div className="relative mt-6 flex-1 overflow-y-auto pr-1">
            <div className="space-y-4">
              {NAV_DATA.map((section) => (
                <section
                  key={section.label}
                  className="rounded-[28px] border border-white/60 bg-white/65 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
                >
                  <div className="mb-3 px-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                      {section.label}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {section.items.map((item) => {
                      const hasChildren = Boolean(item.items?.length);
                      const isExpanded = expandedItems.includes(item.title);
                      const hasActiveChild = Boolean(
                        item.items?.some((subItem) => subItem.url === pathname)
                      );

                      return (
                        <li key={item.title}>
                          {hasChildren ? (
                            <>
                              <MenuItem
                                isActive={hasActiveChild}
                                onClick={() => toggleExpanded(item.title)}
                                className={cn(
                                  "group rounded-[22px] border px-3.5 py-3 transition-all duration-200",
                                  hasActiveChild
                                    ? "border-blue-500 bg-blue-500 text-white shadow-[0_16px_36px_rgba(59,130,246,0.28)]"
                                    : "border-transparent bg-white/40 text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 hover:shadow-sm"
                                )}
                              >
                                <item.icon className="size-5 shrink-0" />
                                <span className="font-medium tracking-tight">
                                  {item.title}
                                </span>

                                <span
                                  className={cn(
                                    "ml-auto inline-flex size-8 items-center justify-center rounded-2xl transition-all",
                                    hasActiveChild
                                      ? "bg-white/15 text-white"
                                      : "bg-slate-100/90 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-700"
                                  )}
                                >
                                  <ChevronUp
                                    className={cn(
                                      "size-4 rotate-180 transition-transform duration-300",
                                      isExpanded && "rotate-0"
                                    )}
                                  />
                                </span>
                              </MenuItem>

                              <div
                                className={cn(
                                  "grid transition-all duration-300 ease-out",
                                  isExpanded
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                                )}
                              >
                                <div className="overflow-hidden">
                                  <ul className="mt-2 space-y-1.5 rounded-[22px] border border-white/60 bg-white/55 p-2 backdrop-blur-md">
                                    {item.items?.map((subItem) => (
                                      <li key={subItem.title}>
                                        <MenuItem
                                          as="link"
                                          href={subItem.url}
                                          isActive={pathname === subItem.url}
                                          className={cn(
                                            "rounded-2xl px-3 py-2.5 text-sm transition-all duration-200",
                                            pathname === subItem.url
                                              ? "bg-blue-50 text-blue-600 shadow-[0_8px_18px_rgba(59,130,246,0.12)] ring-1 ring-blue-200"
                                              : "text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                                          )}
                                        >
                                          {subItem.title}
                                        </MenuItem>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </>
                          ) : (
                            <MenuItem
                              as="link"
                              href={
                                item.url ??
                                "/" + item.title.toLowerCase().replace(/\s+/g, "-")
                              }
                              isActive={pathname === item.url}
                              className={cn(
                                "rounded-[22px] border px-3.5 py-3 transition-all duration-200",
                                pathname === item.url
                                  ? "border-blue-500 bg-blue-500 text-white shadow-[0_16px_36px_rgba(59,130,246,0.28)]"
                                  : "border-transparent bg-white/40 text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 hover:shadow-sm"
                              )}
                            >
                              <item.icon className="size-5 shrink-0" />
                              <span className="font-medium tracking-tight">
                                {item.title}
                              </span>
                            </MenuItem>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
