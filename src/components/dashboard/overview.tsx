"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 4500 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 1700 },
  { name: "May", total: 2200 },
  { name: "Jun", total: 3800 },
  { name: "Jul", total: 3400 },
  { name: "Aug", total: 3000 },
  { name: "Sep", total: 5200 },
  { name: "Oct", total: 5300 },
  { name: "Nov", total: 5800 },
  { name: "Dec", total: 4800 },
];

export function Overview() {
  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Descripción general</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888888', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888888', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            domain={[0, 6000]}
            ticks={[0, 1500, 3000, 4500, 6000]}
          />
          <Bar 
            dataKey="total" 
            fill="#000000" 
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
