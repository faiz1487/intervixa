import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";
import ModulePageLayout from "@/components/modules/ModulePageLayout";

const ScenarioQuestionsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("scenario_questions").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const uniqueTech = [...new Set(data.map(d => d.technology).filter(Boolean))];

  return (
    <ModulePageLayout
      title="Scenario Questions"
      description="Real-world production scenario questions for interviews"
      icon={<AlertTriangle className="w-5 h-5 text-primary-foreground" />}
      data={data}
      loading={loading}
      searchKeys={["scenario", "technology", "explanation"]}
      filters={[
        { key: "technology", label: "Technology", options: uniqueTech },
      ]}
      columns={[
        { key: "scenario", label: "Scenario", className: "max-w-xs" },
        { key: "technology", label: "Technology", render: (v: string) => <span className="font-medium">{v}</span> },
        { key: "explanation", label: "Explanation", className: "max-w-xs", render: (v: string) => <span className="truncate block max-w-[250px]">{v || "—"}</span> },
      ]}
    />
  );
};

export default ScenarioQuestionsPage;
