import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CallDurationChart() {
  const [data, setData] = useState([
    { range: "0-5 min", duration: 20 },
    { range: "5-10 min", duration: 60 },
    { range: "10-15 min", duration: 40 },
    { range: "15-20 min", duration: 15 },
  ]);

  const handleChange = (index: number, value: number) => {
    const updated = [...data];
    updated[index].duration = value;
    setData(updated);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-sky-50 to-sky-100 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Call Duration Analysis</h2>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="duration"
            stroke="#3b82f6"
            fill="url(#colorDuration)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Editable Inputs */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.map((d, i) => (
          <div key={i} className="text-center">
            <label className="block text-sm font-medium text-gray-600">
              {d.range}
            </label>
            <input
              type="number"
              value={d.duration}
              onChange={(e) => handleChange(i, Number(e.target.value))}
              className="w-full mt-1 border border-gray-300 rounded-md p-1 text-center focus:ring-2 focus:ring-sky-300 outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
