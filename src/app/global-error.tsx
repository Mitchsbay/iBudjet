"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-500 mb-6">An unexpected error occurred.</p>
        <button
          onClick={reset}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Try again
        </button>
        <a href="/" className="mt-4 text-sm text-blue-600 hover:underline">
          Return to home
        </a>
      </body>
    </html>
  );
}
