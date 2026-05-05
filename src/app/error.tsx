"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Something went wrong</h2>
      <p className="text-gray-500 mb-6">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="bg-[#1e3a5f] text-white px-6 py-2 rounded-lg hover:bg-[#162d4a] transition-colors"
      >
        Try again
      </button>
      <a href="/" className="mt-4 text-sm text-blue-600 hover:underline">
        Return to home
      </a>
    </div>
  );
}
