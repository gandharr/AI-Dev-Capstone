'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/candidates", label: "Candidates" },
    { href: "/settings", label: "Settings" },
    { href: "/chat", label: "Chat" },
    { href: "/buttons", label: "Buttons Demo" },
    { href: "/3d", label: "3D Core Demo", highlight: true },
  ];

  return (
    <nav aria-label="Main navigation" className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md px-1 py-0.5"
              >
                AI Interview
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map(({ href, label, highlight }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm ${
                      isActive
                        ? "border-primary text-primary font-semibold"
                        : highlight
                        ? "border-transparent text-emerald-500 hover:border-emerald-500 hover:text-emerald-400 font-semibold"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              href="/health"
              aria-current={pathname === "/health" ? "page" : undefined}
              className="text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm px-2 py-1"
            >
              System Status
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="sm:hidden border-t border-border bg-background px-4 pt-2 pb-3 space-y-1">
          {navLinks.map(({ href, label, highlight }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : highlight
                    ? "text-emerald-500 hover:bg-muted"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/health"
            onClick={() => setMobileMenuOpen(false)}
            aria-current={pathname === "/health" ? "page" : undefined}
            className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            System Status
          </Link>
        </div>
      )}
    </nav>
  );
}
