"use client"

import { formatPrice, toSentenceCase } from "@/lib/utils"
import type { bonus } from "@/server/api/bonus"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface OverviewProps {
  data: Awaited<ReturnType<typeof bonus.retrieveMonthlyBonuses>>
}
export function Overview({ data }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${formatPrice(value)}`}
        />
        <Tooltip formatter={(value, name, props) => [formatPrice(value as number), toSentenceCase(name as string)]} />

        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
