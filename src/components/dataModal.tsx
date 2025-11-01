// src/components/dataModal.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

interface CustomDataModalProps {
  open: boolean;
  onClose: () => void;
  onDataLoaded: (data: { category: string; count: number }[]) => void;
  chartType?: string;
  email: string;
}

export default function CustomDataModal({
  open,
  onClose,
  onDataLoaded,
  chartType = "call_analysis",
  email,
}: CustomDataModalProps) {
  const [rawInput, setRawInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Fetch existing data for this user
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!email) return;
      const { data, error } = await supabase
        .from("user_chart_data")
        .select("custom_values")
        .eq("email", email)
        .eq("chart_type", chartType)
        .single();

      if (error) return;
      if (data?.custom_values) {
        const formatted = data.custom_values
          .map((item: any) => `${item.category}:${item.count}`)
          .join(", ");
        setRawInput(formatted);
      }
    };
    fetchExistingData();
  }, [email, chartType]);

  const handleSave = async () => {
    if (!email) {
      setErrorMsg("Missing email address. Please reload.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // ✅ Validate pattern using regex: "word:number"
      const validPattern =
        /^(\s*[A-Za-z0-9\s]+:\s*\d+\s*)(,\s*[A-Za-z0-9\s]+:\s*\d+\s*)*$/;
      if (!validPattern.test(rawInput.trim())) {
        setErrorMsg(
          "❌ Invalid format. Please use `Category:count` pairs separated by commas.\nExample: Caller Identification:35, Incorrect caller identity:20"
        );
        return;
      }

      // Parse valid entries
      const parsed = rawInput.split(",").map((pair) => {
        const [category, countStr] = pair.split(":").map((s) => s.trim());
        return { category, count: Number(countStr) };
      });

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
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Error saving data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f1020] border border-white/10 text-white rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-[#00E5FF] to-[#FF00FF] text-transparent bg-clip-text">
            Create / Update Chart Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-sm text-gray-400">
            Data for <span className="font-semibold text-white">{email}</span>
          </p>

          {/* ✅ Example section */}
          <div className="bg-[#1a1b2e] p-3 rounded-lg border border-white/10 text-sm text-gray-400">
            <p className="mb-1 font-semibold text-white">Example format:</p>
            <p className="font-mono text-gray-300">
              Caller Identification:35, Incorrect caller identity:20
            </p>
            <p className="mt-2 text-xs text-gray-500">
              ➤ Use commas to separate items. ➤ Each pair must be in{" "}
              <span className="text-white">Category:Number</span> format.
            </p>
          </div>

          {/* ✅ Textarea for input */}
          <div>
            <label className="text-sm text-gray-400">Your Custom Data</label>
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
