"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getAllBlogs } from "@/services/api/blogs";
import { getAllSubscribers } from "@/services/api/newsletter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Users, 
  Plus, 
  Edit, 
  Eye, 
  EyeOff,
  Briefcase,
  LogOut,
  Clock,
  Mail,
  MessageCircle,
  AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import BlogEditor from "@/components/admin/BlogEditor";
import AdminSettings from "@/components/admin/AdminSettings";
import JobsManager from "@/components/admin/JobsManager";
import ApplicationsManager from "@/components/admin/ApplicationsManager";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  read_time: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

const Admin = () => {
  const { isAdmin, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/auth");
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    
    try {
      const [blogsRes, subsRes] = await Promise.allSettled([
        getAllBlogs(),
        getAllSubscribers(),
      ]);

      if (blogsRes.status === "fulfilled") {
        setBlogs(blogsRes.value || []);
      } else {
        console.error("Failed to fetch blogs", blogsRes.reason);
        setBlogs([]);
      }

      if (subsRes.status === "fulfilled") {
        setSubscribers(subsRes.value || []);
      } else {
        console.error("Failed to fetch subscribers", subsRes.reason);
        setSubscribers([]);
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }

    setLoadingData(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <main className="pt-20 min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full" />
      </main>
    );
  }

  if (!isAdmin && !isLoading) {
    return (
      <main className="pt-20 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. Contact an administrator for access.
          </p>
          <Button variant="coral" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </main>
    );
  }

  if (editingPost || isCreating) {
    return (
      <main className="pt-20 min-h-screen bg-background">
        <div className="container-tight py-8">
          <BlogEditor
            post={editingPost}
            onClose={() => {
              setEditingPost(null);
              setIsCreating(false);
            }}
            onSave={() => {
              setEditingPost(null);
              setIsCreating(false);
              fetchData();
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-background">
      <div className="container-tight py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your blog posts and newsletter subscribers
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out of the admin dashboard?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSignOut}>Sign Out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Tabs defaultValue="blogs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="blogs" className="gap-2">
              <FileText className="w-4 h-4" />
              Blog Posts ({blogs.length})
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2">
              <Users className="w-4 h-4" />
              Subscribers ({subscribers.length})
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-2" asChild>
              <Link href="/admin/comments">
                <MessageCircle className="w-4 h-4" />
                Comments
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blogs" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="coral" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            {loadingData ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full mx-auto" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No blog posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first blog post to get started
                </p>
                <Button variant="coral" onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-card rounded-lg border border-border p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {blog.image && (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{blog.title}</h3>
                          {blog.is_featured && (
                            <span className="text-xs bg-coral/20 text-coral px-2 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            {blog.is_published ? (
                              <Eye className="w-3 h-3" />
                            ) : (
                              <EyeOff className="w-3 h-3" />
                            )}
                            {blog.is_published ? "Published" : "Draft"}
                          </span>
                          <span>{blog.category}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(blog.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPost(blog)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <JobsManager />
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <ApplicationsManager />
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-4">
            {loadingData ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full mx-auto" />
              </div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No subscribers yet</h3>
                <p className="text-muted-foreground">
                  Subscribers will appear here once they sign up
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Subscribed</th>
                      <th className="text-left p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {subscribers.map((sub) => (
                      <tr key={sub.id}>
                        <td className="p-4">{sub.email}</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(sub.subscribed_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              sub.is_active
                                ? "bg-green/20 text-green"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {sub.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Admin;
