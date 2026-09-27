"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-20 flex-1 flex flex-col items-center text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Unable to load products
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        The product service is not reachable. Please ensure it is running on{" "}
        <code className="text-indigo-600">localhost:4001</code>.
      </p>
      {error.digest && (
        <p className="text-xs text-gray-400 mb-4">Error: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
