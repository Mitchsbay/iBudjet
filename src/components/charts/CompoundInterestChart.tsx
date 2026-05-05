"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { fmtAUD } from "@/lib/utils";

interface ChartPoint {
  year: number;
  principal: number;
  contributions: number;
  interest: number;
  total: number;
}

export default function CompoundInterestChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: 280 }}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 16 }}>
            <defs>
              <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
              label={{ value: "Year", position: "insideBottom", offset: -4, fontSize: 10 }}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 10 }}
              width={48}
            />
            <Tooltip formatter={(v: number) => fmtAUD(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="principal" name="Principal" stackId="1" stroke="#93c5fd" fill="url(#colorPrincipal)" />
            <Area type="monotone" dataKey="contributions" name="Contributions" stackId="1" stroke="#60a5fa" fill="url(#colorContrib)" />
            <Area type="monotone" dataKey="interest" name="Interest Earned" stackId="1" stroke="#22c55e" fill="url(#colorInterest)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
