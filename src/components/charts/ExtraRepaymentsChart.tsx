"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { fmtAUD } from "@/lib/utils";

interface ChartData {
  name: string;
  "Total Interest": number;
  "Loan Principal": number;
}

export default function ExtraRepaymentsChart({ data }: { data: ChartData[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: 280 }}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} barCategoryGap="40%" margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 10 }}
              width={48}
            />
            <Tooltip formatter={(v: number) => fmtAUD(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Loan Principal" stackId="a" fill="#93c5fd" radius={[0, 0, 4, 4]} />
            <Bar dataKey="Total Interest" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
