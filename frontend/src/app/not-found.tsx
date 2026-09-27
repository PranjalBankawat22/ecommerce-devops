import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide mb-3">
        404
      </p>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Page not found
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg">Back to Home</Button>
      </Link>
    </main>
  );
}
