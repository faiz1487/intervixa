import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamChat, type Msg } from "@/lib/chat";
import { toast } from "sonner";

interface ModuleAssistantPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional initial question to send when the panel first opens */
  initialMessage?: string | null;
  /** Short context description of the module, e.g. "HR Contacts" */
  moduleContext?: string;
}

export const ModuleAssistantPanel = ({
  open,
  onOpenChange,
  initialMessage,
  moduleContext,
}: ModuleAssistantPanelProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasSentInitialRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!initialMessage || hasSentInitialRef.current) {
      return;
    }
    hasSentInitialRef.current = true;
    void send(initialMessage);
  }, [open, initialMessage]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const prefix = moduleContext
      ? `You are helping the user while they are viewing the "${moduleContext}" module in the Intervixa dashboard. Answer questions using the data on this page when relevant.\n\nUser: `
      : "";

    const userMsg: Msg = { role: "user", content: `${prefix}${text.trim()}` };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast.error(err);
          setIsLoading(false);
        },
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-lg p-0">
        <SheetHeader className="px-4 pt-4 pb-2 border-b border-border/40">
          <SheetTitle className="flex items-center justify-between">
            <span>Intervixa AI</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 px-4 py-3">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Ask Intervixa AI about anything on this page, like which HR to contact, how to use these links, or how to prepare.
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "glass"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-primary">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass rounded-2xl px-3 py-2 flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
          <div className="border-t border-border/40 px-4 py-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask about the data on this page..."
                className="flex-1 text-sm resize-none"
              />
              <Button
                size="icon"
                className="h-10 w-10 mt-auto"
                disabled={!input.trim() || isLoading}
                onClick={() => void send(input)}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

