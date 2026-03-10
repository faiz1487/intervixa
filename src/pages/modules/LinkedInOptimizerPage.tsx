import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ModuleAssistantPanel } from "@/components/modules/ModuleAssistantPanel";
import { useToast } from "@/hooks/use-toast";

interface LinkedInTip {
  id: string;
  section: string;
  tip: string;
  example: string;
}

const LinkedInOptimizerPage = () => {
  const [items, setItems] = useState<LinkedInTip[]>([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMessage, setAssistantInitialMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await (supabase as any)
        .from("linkedin_tips")
        .select("*")
        .order("section", { ascending: true });
      if (error) {
        console.error(error);
        toast({ title: "Failed to load LinkedIn optimization tips", variant: "destructive" });
        return;
      }
      setItems((data || []) as LinkedInTip[]);
    };
    fetchData();
  }, [toast]);

  const useTip = (tip: LinkedInTip) => {
    const prompt = `Using the following optimization tip and example, help me rewrite my LinkedIn ${tip.section} section:\n\nTip: ${tip.tip}\nExample:\n${tip.example}`;
    setAssistantInitialMessage(prompt);
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">LinkedIn Optimizer</h1>
            <p className="text-sm text-muted-foreground">
              Discover optimization tips for each LinkedIn profile section and refine them with Intervixa AI.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setAssistantInitialMessage("Help me optimize my LinkedIn profile for my target role.");
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
                  <TableHead>Profile Section</TableHead>
                  <TableHead>Optimization Tip</TableHead>
                  <TableHead>Example</TableHead>
                  <TableHead className="w-32">Use with AI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((tip) => (
                  <TableRow key={tip.id}>
                    <TableCell className="whitespace-nowrap align-top">{tip.section}</TableCell>
                    <TableCell className="max-w-md align-top">
                      <div className="text-sm">{tip.tip}</div>
                    </TableCell>
                    <TableCell className="max-w-xl align-top">
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap">{tip.example}</div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => useTip(tip)}>
                        Apply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                      No LinkedIn tips available yet.
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
        moduleContext="LinkedIn Optimizer"
      />
    </div>
  );
};

export default LinkedInOptimizerPage;

