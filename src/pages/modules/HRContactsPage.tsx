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
import { Mail, Copy } from "lucide-react";

interface HRContact {
  id: string;
  name: string;
  company: string;
  email: string | null;
  linkedin: string | null;
}

const PAGE_SIZE = 10;

const HRContactsPage = () => {
  const [items, setItems] = useState<HRContact[]>([]);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMessage, setAssistantInitialMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("hr_contacts").select("*").order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        toast({ title: "Failed to load HR contacts", variant: "destructive" });
        return;
      }
      setItems((data || []) as HRContact[]);
    };
    fetchData();
  }, [toast]);

  const companies = useMemo(() => {
    const set = new Set<string>();
    items.forEach((c) => {
      if (c.company) set.add(c.company);
    });
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((c) => {
      if (companyFilter !== "all" && c.company !== companyFilter) return false;
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        c.company.toLowerCase().includes(term) ||
        (c.email || "").toLowerCase().includes(term) ||
        (c.linkedin || "").toLowerCase().includes(term)
      );
    });
  }, [items, search, companyFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCopyEmail = async (email: string | null) => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      toast({ title: "Email copied to clipboard" });
    } catch {
      toast({ title: "Failed to copy email", variant: "destructive" });
    }
  };

  const handleSendColdEmail = (contact: HRContact) => {
    const basePrompt = `Generate a professional cold outreach email to ${contact.name} at ${contact.company}. 
The goal is to introduce myself for relevant roles and request a conversation about opportunities. 
Write a clear subject line and a concise, impactful email body. 
Address them by name and mention the company specifically.`;

    setAssistantInitialMessage(basePrompt);
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">HR Contacts</h1>
            <p className="text-sm text-muted-foreground">
              Explore curated HR and recruiter contacts you can reach out to for your target roles.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setAssistantInitialMessage("Help me make the best use of these HR contacts.");
              setAssistantOpen(true);
            }}
          >
            Ask Intervixa AI
          </Button>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <Input
              placeholder="Search by name, company, email, or LinkedIn..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-md"
            />
            <div className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground">Filter by company:</span>
              <select
                className="border border-border rounded-md text-sm bg-background px-2 py-1"
                value={companyFilter}
                onChange={(e) => {
                  setCompanyFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>HR Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>LinkedIn</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.company}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email || "-"}</TableCell>
                    <TableCell className="max-w-56 truncate">
                      {c.linkedin ? (
                        <a
                          href={c.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          {c.linkedin}
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          title="Copy email"
                          onClick={() => handleCopyEmail(c.email)}
                          disabled={!c.email}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleSendColdEmail(c)}
                          disabled={!c.email}
                          className="gap-1"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="hidden sm:inline">Send cold email</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      No HR contacts found. Try adjusting your filters.
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
        moduleContext="HR Contacts"
      />
    </div>
  );
};

export default HRContactsPage;

