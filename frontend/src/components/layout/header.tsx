"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useCart } from "@/context/cart-context";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Electronics", href: "/?category=Electronics" },
  { label: "Fashion", href: "/?category=Fashion" },
  { label: "Accessories", href: "/?category=Accessories" },
];

function CartIcon({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label={`Cart, ${count} item${count !== 1 ? "s" : ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386a1.5 1.5 0 0 1 1.473 1.217L6.75 10.5m0 0 1.189 6.433A1.5 1.5 0 0 0 9.407 18h6.186a1.5 1.5 0 0 0 1.468-1.197L18.75 10.5M6.75 10.5h12"
        />
        <circle cx="9" cy="21" r="1" fill="currentColor" />
        <circle cx="17" cy="21" r="1" fill="currentColor" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(value.trim() ? `/?${params}` : "/");
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex-1 max-w-sm">
      <label htmlFor="search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
          />
        </svg>
        <input
          id="search"
          type="search"
          placeholder="Search products…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>
    </form>
  );
}

export function Header() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main row */}
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 text-xl font-bold text-indigo-600 tracking-tight"
          >
            Shoply
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <Suspense fallback={null}>
            <div className="hidden sm:block">
              <SearchBar />
            </div>
          </Suspense>

          {/* Cart */}
          <CartIcon count={totalItems} />

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <nav
            aria-label="Mobile navigation"
            className="md:hidden border-t border-gray-100 py-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
