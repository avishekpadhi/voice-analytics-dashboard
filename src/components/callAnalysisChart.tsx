import { useMemo, useState } from "react";
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
import { supabase } from "../lib/supabaseClient";

interface CallAnalysisData {
  category: string;
  count: number;
}

const initialData: CallAnalysisData[] = [
  { category: "Caller Identification", count: 35 },
  { category: "Incorrect caller identity", count: 20 },
  { category: "User refused to confirm identity", count: 10 },
  { category: "Unsupported Language", count: 15 },
  { category: "Customer Hostility", count: 10 },
  { category: "Verbal Aggression", count: 10 },
  { category: "Call Drop", count: 5 },
  { category: "Technical Error", count: 7 },
  { category: "No Response", count: 4 },
  { category: "Accent Issue", count: 3 },
  { category: "Late Response", count: 12 },
  { category: "Dropped Before Greeting", count: 6 },
  { category: "System Timeout", count: 8 },
  { category: "Agent Not Available", count: 9 },
  { category: "Language Barrier", count: 14 },
];

// Helper to add percentages and group smaller categories
const processData = (data: CallAnalysisData[]) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const enriched = data
    .map((d) => ({
      ...d,
      percentage: (d.count / total) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const top20 = enriched.slice(0, 20);
  const others = enriched.slice(20);

  if (others.length > 0) {
    const otherSum = others.reduce((sum, d) => sum + d.count, 0);
    const otherPercentage = (otherSum / total) * 100;
    top20.push({
      category: "Others",
      count: otherSum,
      percentage: otherPercentage,
    });
  }

  return { processed: top20, total };
};

export default function CallAnalysisChart() {
  const [data, setData] = useState<CallAnalysisData[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  console.log(import.meta.env.VITE_SUPABASE_URL);
  console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);

  const { processed, total } = useMemo(() => processData(data), [data]);
  const chartHeight = Math.min(Math.max(processed.length * 40, 400), 1200);

  // --- Fetch user-specific data from Supabase ---
  const handleLoadData = async () => {
    const email = prompt("Enter your email to load custom data:");
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      const { data: userData, error } = await supabase
        .from("user_chart_data")
        .select("custom_values")
        .eq("email", email)
        .eq("chart_type", "call_duration") // match the value you actually have
        .single();

      if (error) throw error;

      console.log("Fetched data:", userData);

      // ✅ Corrected: access the right field
      if (userData?.custom_values && Array.isArray(userData.custom_values)) {
        setData(userData.custom_values);
        setMessage("✅ Custom data loaded successfully!");
      } else {
        setMessage("⚠️ No custom data found for this email.");
      }
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Error fetching data from Supabase.");
    } finally {
      setLoading(false);
    }
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
                  formatter={(val: number) => `${val.toFixed(1)}%`}
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
    </div>
  );
}
