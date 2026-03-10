import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Question {
  id: string;
  role: string;
  topic: string;
  question: string;
  answer: string;
}

const empty = { role: "", topic: "", question: "", answer: "" };

const AdminQuestions = () => {
  const [items, setItems] = useState<Question[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("interview_questions").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (editing) {
      await supabase.from("interview_questions").update(form).eq("id", editing);
      toast({ title: "Question updated" });
    } else {
      await supabase.from("interview_questions").insert(form);
      toast({ title: "Question added" });
    }
    setOpen(false); setEditing(null); setForm(empty); fetch();
  };

  const handleEdit = (q: Question) => {
    setEditing(q.id);
    setForm({ role: q.role, topic: q.topic, question: q.question, answer: q.answer || "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("interview_questions").delete().eq("id", id);
    toast({ title: "Question deleted" }); fetch();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Interview Questions</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm(empty); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Question</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Question" : "Add Question"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
              <div><Label>Topic</Label><Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></div>
              <div><Label>Question</Label><Textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
              <div><Label>Answer</Label><Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Question</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.role}</TableCell>
                <TableCell>{q.topic}</TableCell>
                <TableCell className="max-w-64 truncate">{q.question}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(q)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No questions yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminQuestions;
