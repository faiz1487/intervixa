import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ModuleAssistantPanel } from "@/components/modules/ModuleAssistantPanel";
import { useToast } from "@/hooks/use-toast";

interface MockInterview {
  id: string;
  role: string;
  question_set: string;
  difficulty: string;
}

const MockInterviewPage = () => {
  const [items, setItems] = useState<MockInterview[]>([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMessage, setAssistantInitialMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await (supabase as any).from("mock_interviews").select("*").order("created_at", {
        ascending: false,
      });
      if (error) {
        console.error(error);
        toast({ title: "Failed to load mock interview sets", variant: "destructive" });
        return;
      }
      setItems((data || []) as MockInterview[]);
    };
    fetchData();
  }, [toast]);

  const startMockInterview = (setItem: MockInterview) => {
    const prompt = `Start a strict mock interview for the role "${setItem.role}" using the "${setItem.question_set}" question set at ${setItem.difficulty} difficulty. Ask one question at a time and score my answers.`;
    setAssistantInitialMessage(prompt);
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mock Interview</h1>
            <p className="text-sm text-muted-foreground">
              Choose a mock interview set and let Intervixa AI interview you.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setAssistantInitialMessage("Help me design a mock interview plan for my target role.");
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
                  <TableHead>Role</TableHead>
                  <TableHead>Question Set</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="w-32">Start</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((setItem) => (
                  <TableRow key={setItem.id}>
                    <TableCell>{setItem.role}</TableCell>
                    <TableCell>{setItem.question_set}</TableCell>
                    <TableCell>{setItem.difficulty}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => startMockInterview(setItem)}>
                        Start with AI
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                      No mock interview sets available yet.
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
        moduleContext="Mock Interview"
      />
    </div>
  );
};

export default MockInterviewPage;

