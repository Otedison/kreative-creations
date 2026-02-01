import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [newPassword, setNewPassword] = useState('');
  const [rotateSecret, setRotateSecret] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      if (!token) return toast({ title: 'Not authenticated', variant: 'destructive' });

      const res = await fetch('/api/admin/rotate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newPassword: newPassword || undefined, rotateSecret }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update');
      }

      const data = await res.json();
      if (data.jwtSecret) setNewSecret(data.jwtSecret);
      toast({ title: 'Updated', description: 'Admin settings updated successfully.' });
      setNewPassword('');
      setRotateSecret(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update', variant: 'destructive' });
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <h3 className="font-semibold">Admin Settings</h3>
      <div className="grid grid-cols-1 gap-3 mt-3">
        <div>
          <Label>New admin password</Label>
          <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep unchanged" />
        </div>
        <div className="flex items-center gap-3">
          <input id="rotate" type="checkbox" checked={rotateSecret} onChange={(e) => setRotateSecret(e.target.checked)} />
          <Label htmlFor="rotate">Rotate JWT secret</Label>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} variant="coral">Update</Button>
          {newSecret && (
            <div className="ml-2">
              <Label>New JWT Secret (copy and store securely)</Label>
              <Input value={newSecret} readOnly />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
