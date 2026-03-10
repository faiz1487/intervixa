import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ModuleAssistantPanel } from "@/components/modules/ModuleAssistantPanel";
import { useToast } from "@/hooks/use-toast";

interface ScenarioQuestion {
  id: string;
  scenario: string;
  technology: string;
  explanation: string;
}

const PAGE_SIZE = 10;

const ScenarioQuestionsPage = () => {
  const [items, setItems] = useState<ScenarioQuestion[]>([]);
  const [search, setSearch] = useState("");
  const [techFilter, setTechFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMessage, setAssistantInitialMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await (supabase as any)
        .from("scenario_questions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        toast({ title: "Failed to load scenario questions", variant: "destructive" });
        return;
      }
      setItems((data || []) as ScenarioQuestion[]);
    };
    fetchData();
  }, [toast]);

  const technologies = useMemo(() => {
    const set = new Set<string>();
    items.forEach((q) => {
      if (q.technology) set.add(q.technology);
    });
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((q) => {
      if (techFilter !== "all" && q.technology !== techFilter) return false;
      if (!term) return true;
      return (
        q.technology.toLowerCase().includes(term) ||
        q.scenario.toLowerCase().includes(term) ||
        q.explanation.toLowerCase().includes(term)
      );
    });
  }, [items, search, techFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Scenario Questions</h1>
            <p className="text-sm text-muted-foreground">
              Practice real-world production scenarios by technology and topic.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setAssistantInitialMessage("Help me prepare for these scenario-based interview questions.");
              setAssistantOpen(true);
            }}
          >
            Ask Intervixa AI
          </Button>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search by scenario, technology, or explanation..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-md"
            />
            <div className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground">Technology:</span>
              <select
                className="border border-border rounded-md text-sm bg-background px-2 py-1"
                value={techFilter}
                onChange={(e) => {
                  setTechFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                {technologies.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead>Technology</TableHead>
                  <TableHead>Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="max-w-md align-top">
                      <div className="text-sm font-medium">{q.scenario}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap align-top">{q.technology}</TableCell>
                    <TableCell className="max-w-xl align-top">
                      <div className="text-sm text-muted-foreground">{q.explanation}</div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-sm">
                      No scenario questions found. Try different filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {pageCount > 1 && (
            <Pagination className="pt-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: pageCount }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(pageCount, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </Card>
      </div>

      <ModuleAssistantPanel
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
        initialMessage={assistantInitialMessage}
        moduleContext="Scenario Questions"
      />
    </div>
  );
};

export default ScenarioQuestionsPage;

