"use client";


import { useState, useMemo, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SaveLoadButtons from "@/components/SaveLoadButtons";
import { fmtAUDExact } from "@/lib/utils";

type Mode = "add" | "remove";

export default function GSTCalculator() {
  const [amount, setAmount] = useState("100");
  const [mode, setMode] = useState<Mode>("add");

  const result = useMemo(() => {
    const val = parseFloat(amount.replace(/,/g, "")) || 0;
    if (!val) return null;
    if (mode === "add") {
      const gst = val * 0.1;
      return { preGST: val, gst, total: val + gst };
    } else {
      const preGST = val / 1.1;
      const gst = val - preGST;
      return { preGST, gst, total: val };
    }
  }, [amount, mode]);

  const handleLoad = useCallback((inputData: Record<string, unknown>) => {
    if (inputData.amount) setAmount(String(inputData.amount));
    if (inputData.mode) setMode(inputData.mode as Mode);
  }, []);

  const inputData = { amount, mode };
  const resultData = result ? { gst: result.gst, total: result.total } : {};

  return (
    <CalculatorLayout
      title="GST Calculator"
      description="Quickly add or remove 10% GST from any amount and see the full breakdown."
      icon="🧾"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">GST Calculation</h2>

          {/* Mode toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("add")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  mode === "add" ? "bg-[#1e3a5f] text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Add GST
              </button>
              <button
                onClick={() => setMode("remove")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  mode === "remove" ? "bg-[#1e3a5f] text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Remove GST
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
                step={0.01}
              />
            </div>
          </div>

          <div className="mt-4">
            <SaveLoadButtons calculatorType="gst" inputData={inputData} resultData={resultData} onLoad={handleLoad} />
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-gray-600 text-sm">Amount (excl. GST)</span>
                <span className="font-semibold text-gray-900">{fmtAUDExact(result.preGST)}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-amber-50">
                <span className="text-amber-700 text-sm font-medium">GST (10%)</span>
                <span className="font-bold text-amber-700">{fmtAUDExact(result.gst)}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-[#1e3a5f]">
                <span className="text-blue-200 text-sm font-medium">Total (incl. GST)</span>
                <span className="font-bold text-white text-lg">{fmtAUDExact(result.total)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
          GST (Goods and Services Tax) is a broad-based tax of 10% on most goods, services and other items sold or consumed in Australia.
          Administered by the Australian Taxation Office (ATO). Some items are GST-free (e.g. basic food, medical services, education).
        </div>
      </div>
    </CalculatorLayout>
  );
}
