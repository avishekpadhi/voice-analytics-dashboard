// lib/hooks/useUserChartData.ts
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { CallAnalysisType } from "../data/callDetails";
import { CallAnalysisData } from "../data/callDetails";

export const useUserChartData = (email: string, chartType: string) => {
  const [data, setData] = useState<CallAnalysisType[]>(CallAnalysisData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasCustomData, setHasCustomData] = useState(false);

  const handleDataLoaded = (newData: { category: string; count: number }[]) => {
    setData(newData); // update the chart data state
    setHasCustomData(true); // flag to indicate user has custom data
    setMessage("✅ Custom data loaded successfully!");
  };

  useEffect(() => {
    if (!email) return;
    const fetchData = async () => {
      setLoading(true);
      setMessage("");
      const { data: userData, error } = await supabase
        .from("user_chart_data")
        .select("custom_values")
        .eq("email", email)
        .eq("chart_type", chartType)
        .maybeSingle();

      if (error) {
        setMessage("⚠️ Error fetching data");
        setHasCustomData(false);
        setData([]);
      } else if (userData?.custom_values?.length) {
        setMessage("✅ Custom data loaded successfully!");
        setHasCustomData(true);
        setData(userData.custom_values);
      } else {
        setMessage("⚠️ No custom data found");
        setHasCustomData(false);
        setData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [email, chartType]);

  return { data, loading, message, hasCustomData, handleDataLoaded };
};
