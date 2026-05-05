"use client";

import { useState, useEffect } from "react";
import { Save, FolderOpen, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { SavedCalculation } from "@/types/supabase";
import { toast } from "sonner";

interface SaveLoadButtonsProps {
  calculatorType: string;
  inputData: Record<string, unknown>;
  resultData: Record<string, unknown>;
  onLoad: (inputData: Record<string, unknown>) => void;
}

export default function SaveLoadButtons({
  calculatorType,
  inputData,
  resultData,
  onLoad,
}: SaveLoadButtonsProps) {
  const [saving, setSaving] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [saved, setSaved] = useState<SavedCalculation[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setIsLoggedIn(!!session?.user)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to save calculations.");
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from("saved_calculations").insert({
        user_id: user.id,
        calculator_type: calculatorType,
        input_data: inputData,
        result_data: resultData,
      });
      if (error) throw error;
      toast.success("Calculation saved!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenLoad = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to load saved calculations.");
      return;
    }
    setLoadOpen(true);
    setLoadingList(true);
    try {
      const { data, error } = await supabase
        .from("saved_calculations")
        .select("*")
        .eq("calculator_type", calculatorType)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      setSaved(data ?? []);
    } catch {
      toast.error("Failed to load saved calculations.");
    } finally {
      setLoadingList(false);
    }
  };

  const handleSelect = (calc: SavedCalculation) => {
    onLoad(calc.input_data as Record<string, unknown>);
    setLoadOpen(false);
    toast.success("Calculation loaded!");
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("saved_calculations").delete().eq("id", id);
    if (!error) {
      setSaved((prev) => prev.filter((c) => c.id !== id));
      toast.success("Deleted.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Results"}
        </button>
        <button
          onClick={handleOpenLoad}
          className="flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0"
          title="Load saved calculation"
        >
          <FolderOpen className="w-4 h-4" />
          Load
        </button>
      </div>
      {!isLoggedIn && (
        <p className="text-xs text-gray-400 mt-1.5">Sign in to save and load your calculations.</p>
      )}

      {/* Load modal */}
      {loadOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setLoadOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col mx-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Load Saved Calculation</h3>
              <button onClick={() => setLoadOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingList ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : saved.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No saved calculations yet.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {saved.map((calc) => {
                    const inputPreview = Object.entries(calc.input_data as Record<string, unknown>)
                      .slice(0, 3)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ");
                    return (
                      <li
                        key={calc.id}
                        onClick={() => handleSelect(calc)}
                        className="flex items-start justify-between gap-3 px-4 sm:px-6 py-4 hover:bg-blue-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                            {new Date(calc.created_at).toLocaleDateString("en-AU", {
                              day: "numeric", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{inputPreview}</p>
                        </div>
                        <button
                          onClick={(e) => handleDelete(calc.id, e)}
                          className="shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
