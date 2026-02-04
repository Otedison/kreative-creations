import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { createJob, deleteJob, getAllJobs, JobPosting, updateJob } from "@/services/api/jobs";

const emptyJob: Omit<JobPosting, "id" | "created_at" | "updated_at"> = {
  title: "",
  category: "",
  type: "",
  location: "",
  summary: "",
  description: "",
  requirements: "",
  is_active: true,
};

const JobsManager = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyJob);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getAllJobs();
      setJobs(data || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const resetForm = () => {
    setForm(emptyJob);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.type.trim() || !form.location.trim()) {
      toast({
        title: "Missing fields",
        description: "Title, type, and location are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await updateJob(editingId, { ...form });
        toast({ title: "Job updated" });
      } else {
        await createJob({ ...form });
        toast({ title: "Job created" });
      }
      resetForm();
      loadJobs();
    } catch (err) {
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job: JobPosting) => {
    setEditingId(job.id || null);
    setForm({
      title: job.title || "",
      category: job.category || "",
      type: job.type || "",
      location: job.location || "",
      summary: job.summary || "",
      description: job.description || "",
      requirements: job.requirements || "",
      is_active: job.is_active ?? true,
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteJob(id);
      toast({ title: "Job deleted" });
      loadJobs();
    } catch (err) {
      toast({ title: "Delete failed", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Job" : "Create Job"}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="Job title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <Input
            placeholder="Category (Design, Engineering...)"
            value={form.category || ""}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          />
          <Input
            placeholder="Type (Full-time, Contract...)"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          />
          <Input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
          />
          <Input
            placeholder="Short summary"
            value={form.summary || ""}
            onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
          />
          <div className="md:col-span-2">
            <Textarea
              rows={4}
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              rows={3}
              placeholder="Requirements"
              value={form.requirements || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, requirements: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.is_active}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
            />
            <span className="text-sm text-muted-foreground">Active listing</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <Button variant="coral" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Job" : "Create Job"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">All Jobs</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-4 border-coral border-t-transparent rounded-full mx-auto" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No jobs yet.</div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-card rounded-lg border border-border p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-[220px]">
                <div className="font-semibold">{job.title}</div>
                <div className="text-sm text-muted-foreground">
                  {job.reference ? `${job.reference} · ` : ""}{job.category ? `${job.category} · ` : ""}{job.type} · {job.location}
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex-1 min-w-[200px]">
                {job.summary || "No summary"}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleEdit(job)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(job.id)}>Delete</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsManager;
