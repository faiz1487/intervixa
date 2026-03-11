import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase } from "lucide-react";
import ModulePageLayout from "@/components/modules/ModulePageLayout";

const NaukriOptimizerPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("naukri_optimizer_tips").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const uniqueSections = [...new Set(data.map(d => d.profile_section).filter(Boolean))];

  return (
    <ModulePageLayout
      title="Naukri Optimizer"
      description="Optimize your Naukri profile for better visibility"
      icon={<Briefcase className="w-5 h-5 text-primary-foreground" />}
      data={data}
      loading={loading}
      searchKeys={["profile_section", "suggestion", "example"]}
      filters={[
        { key: "profile_section", label: "Section", options: uniqueSections },
      ]}
      columns={[
        { key: "profile_section", label: "Profile Section", render: (v: string) => <span className="font-medium">{v}</span> },
        { key: "suggestion", label: "Suggestion", className: "max-w-sm" },
        { key: "example", label: "Example", className: "max-w-xs", render: (v: string) => <span className="truncate block max-w-[200px]">{v || "—"}</span> },
      ]}
    />
  );
};

export default NaukriOptimizerPage;
