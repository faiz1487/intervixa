import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Map, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModulePageLayout from "@/components/modules/ModulePageLayout";

const PrepRoadmapPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("prep_roadmap").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const uniqueRoles = [...new Set(data.map(d => d.role).filter(Boolean))];

  return (
    <ModulePageLayout
      title="Prep Roadmap"
      description="Structured interview preparation roadmaps"
      icon={<Map className="w-5 h-5 text-primary-foreground" />}
      data={data}
      loading={loading}
      searchKeys={["role", "step"]}
      filters={[
        { key: "role", label: "Role", options: uniqueRoles },
      ]}
      columns={[
        { key: "role", label: "Role", render: (v: string) => <span className="font-medium">{v}</span> },
        { key: "step", label: "Step", className: "max-w-sm" },
        { key: "resource_link", label: "Resource", render: (v: string) => v ? (
          <Button variant="ghost" size="sm" onClick={() => window.open(v, "_blank")} className="text-xs gap-1 text-primary">
            <ExternalLink className="w-3 h-3" /> Open
          </Button>
        ) : "—" },
      ]}
    />
  );
};

export default PrepRoadmapPage;
