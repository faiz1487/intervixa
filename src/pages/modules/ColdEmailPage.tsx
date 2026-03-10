import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ModuleAssistantPanel } from "@/components/modules/ModuleAssistantPanel";
import { useToast } from "@/hooks/use-toast";

interface ColdEmailTemplate {
  id: string;
  template_name: string;
  subject: string;
  body: string;
}

const ColdEmailPage = () => {
  const [items, setItems] = useState<ColdEmailTemplate[]>([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMessage, setAssistantInitialMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await (supabase as any)
        .from("cold_email_templates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        toast({ title: "Failed to load cold email templates", variant: "destructive" });
        return;
      }
      setItems((data || []) as ColdEmailTemplate[]);
    };
    fetchData();
  }, [toast]);

  const useTemplate = (tpl: ColdEmailTemplate) => {
    const prompt = `Using the following template, personalize a cold email for my profile and a specific company:\n\nTemplate Name: ${tpl.template_name}\nSubject: ${tpl.subject}\nBody:\n${tpl.body}`;
    setAssistantInitialMessage(prompt);
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Cold Email Templates</h1>
            <p className="text-sm text-muted-foreground">
              Explore proven cold email templates and refine them with Intervixa AI.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setAssistantInitialMessage("Help me write a new cold email from scratch based on my profile.");
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
                  <TableHead>Template Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="w-32">Use with AI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((tpl) => (
                  <TableRow key={tpl.id}>
                    <TableCell>{tpl.template_name}</TableCell>
                    <TableCell className="max-w-xl">
                      <div className="text-sm">{tpl.subject}</div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => useTemplate(tpl)}>
                        Personalize
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-sm">
                      No cold email templates available yet.
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
        moduleContext="Cold Email"
      />
    </div>
  );
};

export default ColdEmailPage;

