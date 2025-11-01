import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

interface CustomDataModalProps {
  open: boolean;
  onClose: () => void;
  onDataLoaded: (data: { category: string; count: number }[]) => void;
  chartType?: string;
}

export default function CustomDataModal({
  open,
  onClose,
  onDataLoaded,
  chartType = "call_analysis",
}: CustomDataModalProps) {
  const [email, setEmail] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async () => {
    if (!email) {
      setErrorMsg("Please enter an email.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Try fetching existing data first
      const { data: existing, error: fetchError } = await supabase
        .from("user_chart_data")
        .select("custom_values")
        .eq("email", email)
        .eq("chart_type", chartType)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      if (existing?.custom_values) {
        onDataLoaded(existing.custom_values);
        onClose();
        return;
      }

      // Parse new data
      const parsed = rawInput
        .split(",")
        .map((pair) => {
          const [category, countStr] = pair.split(":").map((s) => s.trim());
          const count = Number(countStr);
          return { category, count };
        })
        .filter((item) => item.category && !isNaN(item.count));

      const invalidPairs = rawInput.split(",").filter((pair) => {
        const [, countStr] = pair.split(":").map((s) => s.trim());
        return isNaN(Number(countStr));
      });

      if (invalidPairs.length > 0) {
        setErrorMsg(`⚠️ Ignored invalid entries: ${invalidPairs.join(", ")}`);
      }

      if (parsed.length === 0) {
        setErrorMsg("❌ No valid entries found. Please use numeric counts.");
        return;
      }

      // Save valid data
      const { error: insertError } = await supabase
        .from("user_chart_data")
        .upsert([
          {
            email,
            chart_type: chartType,
            custom_values: parsed,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      onDataLoaded(parsed);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("❌ Error saving or fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f1020] border border-white/10 text-white rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-[#00E5FF] to-[#FF00FF] text-transparent bg-clip-text">
            Load or Create Chart Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-[#151528] border border-white/10 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Custom Data (category:count pairs)
            </label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Caller Identification:35, Incorrect caller identity:20"
              className="w-full h-24 bg-[#151528] border border-white/10 rounded-lg p-2 text-sm text-gray-300 mt-1"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400 mt-1 whitespace-pre-line">
              {errorMsg}
            </p>
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-[#00E5FF] to-[#FF00FF] text-white rounded-full hover:scale-105 transition-transform"
          >
            {loading ? "Saving..." : "Save Data"}
          </Button>
          <Button variant="ghost" onClick={onClose} className="text-gray-300">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
