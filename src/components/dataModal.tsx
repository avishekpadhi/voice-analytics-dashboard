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
      if (!email) {
        setRawInput("");
        return;
      }

      const { data, error } = await supabase
        .from("user_chart_data")
        .select("custom_values")
        .eq("email", email)
        .eq("chart_type", chartType)
        .maybeSingle();

      if (error) {
        console.warn("Supabase fetch error:", error.message);
        setRawInput("");
        return;
      }

      if (data?.custom_values?.length) {
        const formatted = data.custom_values
          .map((item: any) => `${item.category}: ${item.count}`)
          .join(", ");
        setRawInput(formatted);
      } else {
        setRawInput("");
      }
    };

    fetchExistingData();
  }, [email, chartType, open]);

  const handleSave = async () => {
    if (!email) {
      setErrorMsg("Missing email address. Please reload.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // ✅ Validate pattern: category must contain only letters/spaces; count must be number
      const validPattern =
        /^(\s*[A-Za-z\s]+:\s*\d+\s*)(,\s*[A-Za-z\s]+:\s*\d+\s*)*$/;
      if (!validPattern.test(rawInput.trim())) {
        setErrorMsg(
          "❌ Invalid format.\n\nEach item must be in `Category:Number` format.\n" +
            "➤ Category: only letters and spaces (no numbers or special characters)\n" +
            "➤ Use commas to separate items\n\nExample:\nCaller Identification:35, Incorrect Caller Identity:20"
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

          {/* 🧩 Instruction section */}
          <div className="bg-[#1a1b2e] p-3 rounded-lg border border-white/10 text-sm text-gray-300 leading-relaxed">
            <p className="font-semibold text-white mb-2">
              🧩 How to format your data
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
              <li>
                Each entry must be in{" "}
                <span className="text-white">Category:Number</span> format.
              </li>
              <li>
                Category names must contain{" "}
                <span className="text-white">only letters and spaces</span> (no
                numbers or symbols).
              </li>
              <li>Use commas to separate multiple entries.</li>
            </ul>

            <div className="mt-3 bg-[#101125] p-2 rounded-md font-mono text-gray-200 text-sm border border-white/5">
              Example:
              <br />
              Caller Identification:35, Incorrect Caller Identity:20
            </div>
          </div>

          {/* 📝 Textarea input */}
          <div>
            <label className="text-sm text-gray-400">Your Custom Data</label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Caller Identification:35, Incorrect Caller Identity:20"
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
