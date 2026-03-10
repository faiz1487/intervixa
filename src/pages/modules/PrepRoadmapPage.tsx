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

interface PrepRoadmap {
  id: string;
  role: string;
  step: string;
  resource_link: string | null;
}

const PAGE_SIZE = 10;

const PrepRoadmapPage = () => {
  const [items, setItems] = useState<PrepRoadmap[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMessage, setAssistantInitialMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await (supabase as any)
        .from("prep_roadmap")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        console.error(error);
        toast({ title: "Failed to load prep roadmap", variant: "destructive" });
        return;
      }
      setItems((data || []) as PrepRoadmap[]);
    };
    fetchData();
  }, [toast]);

  const roles = useMemo(() => {
    const set = new Set<string>();
    items.forEach((row) => {
      if (row.role) set.add(row.role);
    });
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((row) => {
      if (roleFilter !== "all" && row.role !== roleFilter) return false;
      if (!term) return true;
      return (
        row.role.toLowerCase().includes(term) ||
        row.step.toLowerCase().includes(term) ||
        (row.resource_link || "").toLowerCase().includes(term)
      );
    });
  }, [items, search, roleFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Prep Roadmap</h1>
            <p className="text-sm text-muted-foreground">
              Follow a structured preparation roadmap by role, with curated resources.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setAssistantInitialMessage("Help me turn this roadmap into a weekly preparation plan.");
              setAssistantOpen(true);
            }}
          >
            Ask Intervixa AI
          </Button>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search by role, step, or resource..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-md"
            />
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
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Resource Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap align-top">{row.role}</TableCell>
                    <TableCell className="max-w-xl align-top">
                      <div className="text-sm">{row.step}</div>
                    </TableCell>
                    <TableCell className="max-w-md align-top">
                      {row.resource_link ? (
                        <a
                          href={row.resource_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          {row.resource_link}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-sm">
                      No roadmap entries found. Try different filters.
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
        moduleContext="Prep Roadmap"
      />
    </div>
  );
};

export default PrepRoadmapPage;

