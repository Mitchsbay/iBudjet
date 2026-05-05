"use client";


import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SavedCalculation } from "@/types/supabase";

import { Trash2, ExternalLink, BookMarked, Loader2 } from "lucide-react";
import { CALCULATOR_META } from "@/lib/utils";
import { toast } from "sonner";

export default function SavedCalculationsPage() {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setIsLoggedIn(true);
      const { data } = await supabase
        .from("saved_calculations")
        .select("*")
        .order("created_at", { ascending: false });
      setCalculations(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("saved_calculations").delete().eq("id", id);
    if (!error) {
      setCalculations((prev) => prev.filter((c) => c.id !== id));
      toast.success("Deleted.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <BookMarked className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view saved calculations</h1>
        <p className="text-gray-500 mb-8">Save your calculator results and access them anytime.</p>
        <a href="/" className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#162d4a] transition-colors">
          Go to calculators
        </a>
      </div>
    );
  }

  const grouped = calculations.reduce<Record<string, SavedCalculation[]>>((acc, c) => {
    (acc[c.calculator_type] = acc[c.calculator_type] ?? []).push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <BookMarked className="w-7 h-7 text-[#1e3a5f]" />
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Saved Calculations</h1>
      </div>

      {calculations.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookMarked className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No saved calculations yet.</p>
          <p className="text-sm mt-1">Use any calculator and click &quot;Save Results&quot; to store it here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => {
            const meta = CALCULATOR_META[type];
            return (
              <div key={type}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <span>{meta?.icon ?? "📊"}</span>
                    {meta?.label ?? type}
                  </h2>
                  {meta && (
                    <a href={meta.href} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      Open calculator <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <ul className="divide-y divide-gray-50">
                    {items.map((calc) => {
                      const inputPreview = Object.entries(calc.input_data as Record<string, unknown>)
                        .slice(0, 4)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" · ");
                      return (
                        <li key={calc.id} className="flex items-start justify-between gap-3 px-4 sm:px-5 py-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(calc.created_at).toLocaleDateString("en-AU", {
                                weekday: "short", day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{inputPreview}</p>
                          </div>
                          <button
                            onClick={() => handleDelete(calc.id)}
                            className="shrink-0 p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
