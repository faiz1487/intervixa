import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Linkedin } from "lucide-react";
import ModulePageLayout from "@/components/modules/ModulePageLayout";

const LinkedInOptimizerPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("linkedin_optimizer_tips").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const uniqueSections = [...new Set(data.map(d => d.section).filter(Boolean))];

  return (
    <ModulePageLayout
      title="LinkedIn Optimizer"
      description="Optimize your LinkedIn profile for recruiters"
      icon={<Linkedin className="w-5 h-5 text-primary-foreground" />}
      data={data}
      loading={loading}
      searchKeys={["section", "optimization_tip", "example"]}
      filters={[
        { key: "section", label: "Section", options: uniqueSections },
      ]}
      columns={[
        { key: "section", label: "Profile Section", render: (v: string) => <span className="font-medium">{v}</span> },
        { key: "optimization_tip", label: "Optimization Tip", className: "max-w-sm" },
        { key: "example", label: "Example", className: "max-w-xs", render: (v: string) => <span className="truncate block max-w-[200px]">{v || "—"}</span> },
      ]}
    />
  );
};

export default LinkedInOptimizerPage;
