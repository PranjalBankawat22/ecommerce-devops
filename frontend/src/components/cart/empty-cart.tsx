import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
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
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-500 text-sm max-w-xs mb-8">
        Discover products and add something you love.
      </p>
      <Link href="/">
        <Button size="lg">Continue Shopping</Button>
      </Link>
    </div>
  );
}
