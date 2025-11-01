import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#a5b4fc", "#93c5fd", "#60a5fa", "#c7d2fe"];

const data = [
  { name: "Unsupported Language", value: 40 },
  { name: "Assistant did not speak Spanish", value: 20 },
  { name: "Verbal Aggression", value: 15 },
  { name: "Customer Hostility", value: 15 },
  { name: "Caller Identification", value: 10 },
];

export default function SadPathChart() {
  return (
    <div className="p-6 bg-gradient-to-b from-indigo-50 to-indigo-100 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Sad Path Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
