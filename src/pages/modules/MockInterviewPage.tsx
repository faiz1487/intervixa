import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ModulePageLayout from "@/components/modules/ModulePageLayout";

const MockInterviewPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("mock_interviews").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const uniqueRoles = [...new Set(data.map(d => d.role).filter(Boolean))];
  const uniqueDifficulty = [...new Set(data.map(d => d.difficulty).filter(Boolean))];

  return (
    <ModulePageLayout
      title="Mock Interview"
      description="Practice with mock interview question sets"
      icon={<Mic className="w-5 h-5 text-primary-foreground" />}
      data={data}
      loading={loading}
      searchKeys={["role", "question_set", "difficulty"]}
      filters={[
        { key: "role", label: "Role", options: uniqueRoles },
        { key: "difficulty", label: "Difficulty", options: uniqueDifficulty },
      ]}
      columns={[
        { key: "role", label: "Role", render: (v: string) => <span className="font-medium">{v}</span> },
        { key: "question_set", label: "Question Set", className: "max-w-sm" },
        { key: "difficulty", label: "Difficulty", render: (v: string) => (
          <Badge variant={v === "Hard" ? "destructive" : v === "Easy" ? "secondary" : "outline"}>{v}</Badge>
        )},
      ]}
    />
  );
};

export default MockInterviewPage;
