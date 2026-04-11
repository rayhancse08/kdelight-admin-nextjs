"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } =
    useSidebarContext();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? [] : [title]
    );
  };

  // ✅ FIXED (no more "never" error)
  useEffect(() => {
    NAV_DATA.forEach((section) => {
      section.items.forEach((item) => {
        item.items?.forEach((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }
          }
        });
      });
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r bg-white transition-all",
          isMobile
            ? "fixed top-0 bottom-0 z-50"
            : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0"
        )}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          {/* Logo */}
          <div className="relative pr-4.5">
            <Link
              href="/"
              onClick={() => isMobile && toggleSidebar()}
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <ArrowLeftIcon className="size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex-1 overflow-y-auto pr-3">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium">
                  {section.label}
                </h2>

                <ul className="space-y-2">
                  {section.items.map((item) => {
                    const hasChildren =
                      item.items && item.items.length > 0;

                    return (
                      <li key={item.title}>
                        {hasChildren ? (
                          <>
                            <MenuItem
                              isActive={item.items!.some(
                                (sub) => sub.url === pathname
                              )}
                              onClick={() =>
                                toggleExpanded(item.title)
                              }
                            >
                              <item.icon className="size-6" />
                              <span>{item.title}</span>

                              <ChevronUp
                                className={cn(
                                  "ml-auto rotate-180 transition-transform",
                                  expandedItems.includes(
                                    item.title
                                  ) && "rotate-0"
                                )}
                              />
                            </MenuItem>

                            {expandedItems.includes(
                              item.title
                            ) && (
                              <ul className="ml-9 space-y-1.5 pt-2 pb-3">
                                {item.items!.map((subItem) => (
                                  <li key={subItem.title}>
                                    <MenuItem
                                      as="link"
                                      href={subItem.url}
                                      isActive={
                                        pathname === subItem.url
                                      }
                                    >
                                      {subItem.title}
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <MenuItem
                            as="link"
                            href={
                              item.url ??
                              "/" +
                              item.title
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                            }
                            isActive={pathname === item.url}
                          >
                            <item.icon className="size-6" />
                            <span>{item.title}</span>
                          </MenuItem>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}