import { useState } from "react";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

interface CallData {
  date: string;
  average_duration: number;
  total_calls: number;
}

const initialData: CallData[] = [
  { date: "Mon", average_duration: 3.2, total_calls: 98 },
  { date: "Tue", average_duration: 3.8, total_calls: 120 },
  { date: "Wed", average_duration: 4.1, total_calls: 140 },
  { date: "Thu", average_duration: 2.9, total_calls: 105 },
  { date: "Fri", average_duration: 3.6, total_calls: 134 },
];

export default function CallDurationChart() {
  const [data] = useState<CallData[]>(initialData);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-center mb-4 bg-gradient-to-r from-[#00e5ff] to-[#ff00ff] text-transparent bg-clip-text">
        Call Duration Analysis
      </h2>

      <div className="rounded-2xl bg-gradient-to-br from-[#0f0f1a] via-[#161624] to-[#0b0b12] p-4 shadow-2xl">
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart
            data={data}
            margin={{ top: 30, right: 40, left: 20, bottom: 10 }}
          >
            {/* Chart Gradients */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff00ff" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#ff00ff" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />

            {/* X-Axis */}
            <XAxis
              dataKey="date"
              stroke="#aaa"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#aaa", fontSize: 14 }}
            />

            {/* Left Y-Axis (Average Duration) */}
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#00e5ff"
              tick={{ fill: "#00e5ff" }}
              label={{
                value: "Avg Duration (min)",
                angle: -90,
                position: "insideLeft",
                fill: "#00e5ff",
              }}
            />

            {/* Right Y-Axis (Total Calls) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#ff00ff"
              tick={{ fill: "#ff00ff" }}
              label={{
                value: "Total Calls",
                angle: 90,
                position: "insideRight",
                fill: "#ff00ff",
              }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,15,25,0.95)",
                border: "1px solid #333",
                borderRadius: "10px",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />

            {/* Legend */}
            <Legend
              verticalAlign="top"
              align="center"
              iconType="circle"
              wrapperStyle={{ paddingBottom: "10px", color: "#ccc" }}
            />

            {/* Bar Chart (Total Calls) */}
            <Bar
              yAxisId="right"
              dataKey="total_calls"
              fill="url(#barGradient)"
              barSize={24}
              radius={[8, 8, 0, 0]}
            />

            {/* Line Chart (Average Duration) */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="average_duration"
              stroke="#00e5ff"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#00e5ff",
                stroke: "#fff",
                strokeWidth: 1.5,
              }}
              activeDot={{
                r: 7,
                fill: "#ffffff",
                stroke: "#00e5ff",
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
