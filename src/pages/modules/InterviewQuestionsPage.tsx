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

interface InterviewQuestion {
  id: string;
  role: string;
  topic: string;
  question: string;
  answer: string | null;
}

const PAGE_SIZE = 10;

const InterviewQuestionsPage = () => {
  const [items, setItems] = useState<InterviewQuestion[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMessage, setAssistantInitialMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("interview_questions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        toast({ title: "Failed to load questions", variant: "destructive" });
        return;
      }
      setItems((data || []) as InterviewQuestion[]);
    };
    fetchData();
  }, [toast]);

  const roles = useMemo(() => {
    const set = new Set<string>();
    items.forEach((q) => {
      if (q.role) set.add(q.role);
    });
    return Array.from(set).sort();
  }, [items]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    items.forEach((q) => {
      if (q.topic) set.add(q.topic);
    });
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((q) => {
      if (roleFilter !== "all" && q.role !== roleFilter) return false;
      if (topicFilter !== "all" && q.topic !== topicFilter) return false;
      if (!term) return true;
      return (
        q.role.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term) ||
        q.question.toLowerCase().includes(term)
      );
    });
  }, [items, search, roleFilter, topicFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleExplainQuestion = (q: InterviewQuestion) => {
    const prompt = `Explain this interview question in detail and give hints on how to answer it well:\n\nRole: ${q.role}\nTopic: ${q.topic}\nQuestion: ${q.question}`;
    setAssistantInitialMessage(prompt);
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Interview Questions</h1>
            <p className="text-sm text-muted-foreground">
              Browse real interview questions by role and topic, and ask Intervixa AI how to approach them.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setAssistantInitialMessage("Help me create a study plan using these interview questions.");
              setAssistantOpen(true);
            }}
          >
            Ask Intervixa AI
          </Button>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search by role, topic, or question text..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-md"
            />
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground">Role:</span>
                <select
                  className="border border-border rounded-md text-sm bg-background px-2 py-1"
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground">Topic:</span>
                <select
                  className="border border-border rounded-md text-sm bg-background px-2 py-1"
                  value={topicFilter}
                  onChange={(e) => {
                    setTopicFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-32">Ask AI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{q.role}</TableCell>
                    <TableCell>{q.topic}</TableCell>
                    <TableCell className="max-w-xl">
                      <div className="text-sm">{q.question}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExplainQuestion(q)}
                      >
                        Explain with AI
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                      No questions found. Try changing your filters.
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
        moduleContext="Interview Questions"
      />
    </div>
  );
};

export default InterviewQuestionsPage;

