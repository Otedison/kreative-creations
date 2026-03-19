"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";
import { createBlog, updateBlog, deleteBlog } from "@/services/api/blogs";

interface BlogPost {
  id?: string;
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
}

interface BlogEditorProps {
  post?: BlogPost | null;
  onClose: () => void;
  onSave: () => void;
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const BlogEditor = ({ post, onClose, onSave }: BlogEditorProps) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    category: "",
    read_time: "",
    is_published: false,
    is_featured: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setFormData({
        id: post.id,
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image || "",
        author: post.author || "",
        category: post.category || "",
        read_time: post.read_time || "",
        is_published: post.is_published || false,
        is_featured: post.is_featured || false,
      });
    }
  }, [post]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.id ? prev.slug : generateSlug(title),
    }));
  };

  const handleSave = async (publish = false) => {
    setIsLoading(true);

    const dataToSave = {
      ...formData,
      is_published: publish ? true : formData.is_published,
      published_at: publish ? new Date().toISOString() : undefined,
    };

    try {
      if (formData.id) {
        await updateBlog(formData.id, dataToSave as any);
      } else {
        await createBlog(dataToSave as any);
      }

      toast({
        title: publish ? "Blog Published!" : "Blog Saved!",
        description: publish
          ? "Your blog post is now live."
          : "Your changes have been saved.",
      });
      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Request failed',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id || !confirm("Are you sure you want to delete this post?")) return;

    setIsLoading(true);
    try {
      await deleteBlog(formData.id);

      toast({ title: "Blog Deleted", description: "The post has been removed." });
      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Request failed',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>
        <div className="flex gap-2">
          {formData.id && (
            <Button variant="outline" onClick={handleDelete} disabled={isLoading}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => handleSave(false)} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="coral" onClick={() => handleSave(true)} disabled={isLoading}>
            <Eye className="w-4 h-4 mr-2" />
            {formData.is_published ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Enter blog title..."
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg p-4 space-y-4 border border-border">
            <h3 className="font-semibold">Post Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="url-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Brief description..."
                rows={3}
              />
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, image: url }))
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  placeholder="Category"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="read_time">Read Time</Label>
              <Input
                id="read_time"
                value={formData.read_time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, read_time: e.target.value }))
                }
                placeholder="5 min read"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured Post</Label>
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_featured: checked }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
