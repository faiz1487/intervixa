import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ModuleAssistantPanel } from "@/components/modules/ModuleAssistantPanel";
import { useToast } from "@/hooks/use-toast";

interface NaukriTip {
  id: string;
  section: string;
  suggestion: string;
  example: string;
}

const NaukriOptimizerPage = () => {
  const [items, setItems] = useState<NaukriTip[]>([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMessage, setAssistantInitialMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await (supabase as any)
        .from("naukri_tips")
        .select("*")
        .order("section", { ascending: true });
      if (error) {
        console.error(error);
        toast({ title: "Failed to load Naukri optimization tips", variant: "destructive" });
        return;
      }
      setItems((data || []) as NaukriTip[]);
    };
    fetchData();
  }, [toast]);

  const useTip = (tip: NaukriTip) => {
    const prompt = `Using the following suggestion and example, help me rewrite my Naukri ${tip.section} section:\n\nSuggestion: ${tip.suggestion}\nExample:\n${tip.example}`;
    setAssistantInitialMessage(prompt);
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Naukri Optimizer</h1>
            <p className="text-sm text-muted-foreground">
              Improve each section of your Naukri profile using curated suggestions and examples.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setAssistantInitialMessage("Help me optimize my Naukri profile for better recruiter visibility.");
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
                  <TableHead>Suggestion</TableHead>
                  <TableHead>Example</TableHead>
                  <TableHead className="w-32">Use with AI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((tip) => (
                  <TableRow key={tip.id}>
                    <TableCell className="whitespace-nowrap align-top">{tip.section}</TableCell>
                    <TableCell className="max-w-md align-top">
                      <div className="text-sm">{tip.suggestion}</div>
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
                      No Naukri tips available yet.
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
        moduleContext="Naukri Optimizer"
      />
    </div>
  );
};

export default NaukriOptimizerPage;

