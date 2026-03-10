import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MessageSquare, Contact, FileText, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, questions: 0, hrContacts: 0, templates: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [jobs, questions, hrContacts, templates] = await Promise.all([
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("interview_questions").select("id", { count: "exact", head: true }),
        supabase.from("hr_contacts").select("id", { count: "exact", head: true }),
        supabase.from("resume_templates").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        jobs: jobs.count ?? 0,
        questions: questions.count ?? 0,
        hrContacts: hrContacts.count ?? 0,
        templates: templates.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Job Listings", value: stats.jobs, icon: Briefcase, color: "text-blue-500" },
    { label: "Interview Questions", value: stats.questions, icon: MessageSquare, color: "text-green-500" },
    { label: "HR Contacts", value: stats.hrContacts, icon: Contact, color: "text-purple-500" },
    { label: "Resume Templates", value: stats.templates, icon: FileText, color: "text-orange-500" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
