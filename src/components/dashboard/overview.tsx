"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useState, useEffect } from "react";

interface OverviewProps {
  maintenanceHistory: any[];
}

export function Overview({ maintenanceHistory }: OverviewProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [maxReports, setMaxReports] = useState(0);

  useEffect(() => {
    const monthlyData = processMaintenanceData(maintenanceHistory);
    setChartData(monthlyData);
    const max = Math.max(...monthlyData.map(item => item.total));
    setMaxReports(max);
  }, [maintenanceHistory]);

  const yAxisTicks = generateYAxisTicks(maxReports);

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Reportes Generados por Mes</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
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
            domain={[0, yAxisTicks[yAxisTicks.length - 1]]}
            ticks={yAxisTicks}
          />
          <Tooltip />
          <Bar 
            dataKey="total" 
            fill="#000000" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function processMaintenanceData(data: any[]) {
  const monthlyData = Array(12).fill(0).map((_, i) => ({
    name: new Date(2023, i).toLocaleString('default', { month: 'short' }),
    total: 0
  }));

  data.forEach(item => {
    const startDate = new Date(item.fechaInicio);
    const endDate = new Date(item.fechaFin);
    const monthStart = startDate.getMonth();
    const monthEnd = endDate.getMonth();

    for (let month = monthStart; month <= monthEnd; month++) {
      monthlyData[month].total += 1;
    }
  });

  return monthlyData;
}

function generateYAxisTicks(maxValue: number) {
  const ceiling = Math.ceil(maxValue / 10) * 10;
  const step = Math.max(1, Math.floor(ceiling / 5));
  return Array.from({ length: 6 }, (_, i) => i * step);
}
