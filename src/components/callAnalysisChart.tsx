import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import CustomDataModal from "./dataModal";
import { processData } from "../lib/utils";
import { useUserChartData } from "../lib/hooks/useUserChartData";

const CallAnalysisChart: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { data, loading, message, hasCustomData, handleDataLoaded } =
    useUserChartData(userEmail, "call_analysis");

  const { processed, total } = useMemo(() => processData(data), [data]);
  const chartHeight = Math.min(Math.max(processed.length * 40, 400), 1200);

  const handleLoadData = () => {
    const email = prompt("Enter your email to load custom data:");
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Invalid email. Please enter a valid one.");
      return;
    }
    setUserEmail(email.trim());
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-4xl font-semibold text-center mb-2 bg-gradient-to-r from-[#00E5FF] to-[#FF00FF] text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,0,255,0.3)]">
        Call Analysis Overview
      </h2>

      {/* Load Data Button */}
      <button
        onClick={handleLoadData}
        disabled={loading}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF00FF] text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
      >
        {loading ? "Loading..." : "Load My Data"}
      </button>

      {message && <p className="text-sm text-gray-400 mt-1">{message}</p>}

      {userEmail && (
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-[#FF00FF] to-[#00E5FF] text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
        >
          {hasCustomData ? "Update Your Data" : "Add Your Data"}
        </button>
      )}

      {/* Chart */}
      <div className="w-full max-w-6xl bg-gradient-to-br from-[#0b0b1a] via-[#0f1020] to-[#151528] border border-white/8 rounded-3xl p-6 shadow-lg">
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processed}
              layout="vertical"
              margin={{ top: 10, right: 60, left: 20, bottom: 40 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#FF00FF" stopOpacity={0.95} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#22202b" />
              <XAxis
                type="number"
                tick={{ fill: "#aaa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="category"
                width={260}
                tickMargin={8}
                tick={{ fill: "#ddd", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20,20,30,0.95)",
                  border: "1px solid #333",
                  borderRadius: "10px",
                  color: "#fff",
                  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                }}
                formatter={(value: number, _name: string, props) => [
                  `${value} (${props.payload.percentage.toFixed(1)}%)`,
                  "Count",
                ]}
              />
              <Bar
                dataKey="count"
                fill="url(#barGradient)"
                radius={[0, 10, 10, 0]}
                barSize={20}
              >
                <LabelList
                  dataKey="percentage"
                  position="right"
                  fill="#fff"
                  fontSize={12}
                  formatter={(val) =>
                    typeof val === "number" ? `${val.toFixed(1)}%` : val
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div />
          <div className="flex flex-col items-end">
            <div className="text-gray-400 text-xs uppercase tracking-widest">
              Total Incidents
            </div>
            <div className="mt-1 inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#0b0f16] to-[#121218] border border-white/6">
              <span className="text-3xl font-bold bg-gradient-to-r from-[#00E5FF] to-[#FF00FF] text-transparent bg-clip-text">
                {total}
              </span>
            </div>
          </div>
        </div>
      </div>

      <CustomDataModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onDataLoaded={handleDataLoaded}
        chartType="call_analysis"
        email={userEmail}
      />
    </div>
  );
};

export default CallAnalysisChart;
