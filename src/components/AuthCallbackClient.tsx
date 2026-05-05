"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const completeSignIn = async () => {
      const code = searchParams?.get("code");
      const next = searchParams?.get("next") || "/admin/articles";

      if (!code) {
        router.replace("/");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error", error.message);
        router.replace("/");
        return;
      }

      router.replace(next);
    };

    completeSignIn();
  }, [router, searchParams]);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-[#1e3a5f]">Signing you in...</h1>
      <p className="mt-2 text-sm text-gray-500">Please wait while iBudget completes your login.</p>
    </div>
  );
}

export default function AuthCallbackClient() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-20 text-center">
      <Suspense fallback={<p className="text-sm text-gray-500">Completing sign in...</p>}>
        <AuthCallbackContent />
      </Suspense>
    </main>
  );
}
