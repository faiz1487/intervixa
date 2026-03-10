import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ModuleAssistantPanel } from "@/components/modules/ModuleAssistantPanel";
import { useToast } from "@/hooks/use-toast";

interface ATSScore {
  id: string;
  created_at: string;
  title: string;
  target_role: string;
  score: number;
}

const ATSResumeScorePage = () => {
  const [items, setItems] = useState<ATSScore[]>([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMessage, setAssistantInitialMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await (supabase as any)
        .from("ats_resume_scores")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        toast({ title: "Failed to load ATS scores", variant: "destructive" });
        return;
      }
      setItems((data || []) as ATSScore[]);
    };
    fetchData();
  }, [toast]);

  const reviewScore = (row: ATSScore) => {
    const prompt = `Review this ATS score result and tell me how to improve my resume:\n\nTitle: ${row.title}\nTarget Role: ${row.target_role}\nScore: ${row.score}/100.\nGive me specific bullet-point recommendations.`;
    setAssistantInitialMessage(prompt);
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">ATS Resume Scores</h1>
            <p className="text-sm text-muted-foreground">
              View your previous ATS resume scores and ask Intervixa AI how to improve them.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setAssistantInitialMessage("Help me understand how ATS scoring works and how to improve my resume.");
              setAssistantOpen(true);
            }}
          >
            Ask Intervixa AI
          </Button>
        </div>

        <Card className="p-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Target Role</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="w-40">Improve with AI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.target_role}</TableCell>
                    <TableCell>{row.score}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => reviewScore(row)}>
                        Review with AI
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      No ATS scores recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <ModuleAssistantPanel
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
        initialMessage={assistantInitialMessage}
        moduleContext="ATS Resume Score"
      />
    </div>
  );
};

export default ATSResumeScorePage;

