import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquareMore } from "lucide-react";
import ModulePageLayout from "@/components/modules/ModulePageLayout";

const InterviewQuestionsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("interview_questions").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const uniqueRoles = [...new Set(data.map(d => d.role).filter(Boolean))];
  const uniqueTopics = [...new Set(data.map(d => d.topic).filter(Boolean))];

  return (
    <ModulePageLayout
      title="Interview Questions"
      description="Browse curated interview questions by role and topic"
      icon={<MessageSquareMore className="w-5 h-5 text-primary-foreground" />}
      data={data}
      loading={loading}
      searchKeys={["question", "role", "topic"]}
      filters={[
        { key: "role", label: "Role", options: uniqueRoles },
        { key: "topic", label: "Topic", options: uniqueTopics },
      ]}
      columns={[
        { key: "role", label: "Role", render: (v: string) => <span className="font-medium">{v}</span> },
        { key: "topic", label: "Topic" },
        { key: "question", label: "Question", className: "max-w-xs" },
        { key: "answer", label: "Answer", className: "max-w-xs truncate", render: (v: string) => <span className="truncate block max-w-[200px]">{v || "—"}</span> },
      ]}
    />
  );
};

export default InterviewQuestionsPage;
