import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { deleteApplication, getAllApplications, JobApplication, updateApplication } from "@/services/api/jobs";

const statusOptions = ["new", "reviewed", "shortlisted", "rejected", "hired"];

const ApplicationsManager = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getAllApplications();
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (id: string | undefined, status: string, notes?: string) => {
    if (!id) return;
    try {
      setSavingId(id);
      await updateApplication(id, { status, notes });
      toast({ title: "Application updated" });
      loadApplications();
    } catch (err) {
      toast({ title: "Update failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteApplication(id);
      toast({ title: "Application deleted" });
      loadApplications();
    } catch (err) {
      toast({ title: "Delete failed", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-4 border-coral border-t-transparent rounded-full mx-auto" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-sm text-muted-foreground">No applications yet.</div>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="bg-card rounded-lg border border-border p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{app.name}</div>
                <div className="text-sm text-muted-foreground">{app.email}{app.phone ? ` · ${app.phone}` : ""}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {app.job_title ? `Role: ${app.job_title}` : `Job ID: ${app.job_id}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue={app.status || "new"}
                  onChange={(e) => handleStatusChange(app.id, e.target.value, app.notes || "")}
                  disabled={savingId === app.id}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <Button variant="destructive" onClick={() => handleDelete(app.id)} disabled={savingId === app.id}>
                  Delete
                </Button>
              </div>
            </div>
            {(app.portfolio || app.resume_url) && (
              <div className="text-sm text-muted-foreground">
                {app.portfolio && (
                  <div>Portfolio: <a href={app.portfolio} className="text-coral underline">View</a></div>
                )}
                {app.resume_url && (
                  <div>Resume: <a href={app.resume_url} className="text-coral underline">View</a></div>
                )}
              </div>
            )}
            {app.cover_letter && (
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {app.cover_letter}
              </div>
            )}
            <div>
              <Textarea
                rows={2}
                defaultValue={app.notes || ""}
                placeholder="Internal notes"
                onBlur={(e) => handleStatusChange(app.id, app.status || "new", e.target.value)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationsManager;
