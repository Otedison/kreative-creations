"use client";

import { useState, useEffect } from "react";
import { MessageCircle, User, Send, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

// Types
interface Comment {
  id?: string;
  blog_id: string;
  author_name: string;
  author_email: string;
  author_avatar?: string | null;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  isAdmin?: boolean;
}

interface CommentWithAuthor extends Omit<Comment, 'author_email'> {
  author_avatar?: string;
  isAdmin?: boolean;
}

interface CommentSectionProps {
  slug: string;
  blogId?: string;
}

// API URL - change this to your server URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const CommentSection = ({ slug, blogId }: CommentSectionProps) => {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  // Form state
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");

  // Demo comments for display when no approved comments exist
  const demoComments: CommentWithAuthor[] = [
    {
      id: "demo-1",
      blog_id: "",
      author_name: "Sarah Johnson",
      author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "Great article! I've been looking for this kind of insights for a while. The section about performance optimization was particularly helpful.",
      is_approved: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "demo-2",
      blog_id: "",
      author_name: "Michael Chen",
      author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "Excellent breakdown of the concepts. Would love to see a follow-up article about advanced implementations.",
      is_approved: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      isAdmin: true,
    },
    {
      id: "demo-3",
      blog_id: "",
      author_name: "Emily Davis",
      content: "Thanks for sharing this! The practical examples really helped me understand the concepts better.",
      is_approved: true,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  // Fetch comments for this blog post from MongoDB API
  const fetchComments = async () => {
    if (!blogId) {
      console.log("[Comments] No blogId provided, using demo comments");
      setComments(demoComments);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("[Comments] Fetching comments for blogId:", blogId);
      
      const response = await fetch(`${API_URL}/comments?blogId=${encodeURIComponent(blogId)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Comments] Error fetching comments:", errorData);
        setDebugInfo(`HTTP ${response.status}: ${errorData.message || 'Failed to fetch comments'}`);
        setComments(demoComments);
      } else {
        const data = await response.json();
        console.log("[Comments] Successfully fetched", data.length, "comments");
        
        if (data && data.length > 0) {
          setComments(data.map((comment: Comment) => ({
            ...comment,
            author_name: comment.author_name,
            author_avatar: comment.author_avatar || undefined,
            isAdmin: false,
          })));
        } else {
          // No approved comments yet, show demo comments as examples
          console.log("[Comments] No approved comments found, using demo comments");
          setComments(demoComments);
        }
      }
    } catch (err) {
      console.error("[Comments] Exception fetching comments:", err);
      setDebugInfo("Failed to connect to comments server. Using demo comments.");
      setComments(demoComments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("[Comments] Component mounted, slug:", slug, "blogId:", blogId);
    fetchComments();
  }, [slug, blogId]);

  const handleSubmit = async () => {
    if (!blogId) {
      setError("Unable to submit comment. Blog post not identified.");
      console.error("[Comments] Submission failed: No blogId");
      return;
    }

    if (!authorName.trim() || !authorEmail.trim() || !commentContent.trim()) {
      setError("Please fill in all fields.");
      console.warn("[Comments] Validation failed: Missing required fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      setError("Please enter a valid email address.");
      console.warn("[Comments] Validation failed: Invalid email format");
      return;
    }

    setSubmitting(true);
    setError(null);
    setDebugInfo(null);

    console.log("[Comments] Attempting to submit comment for blogId:", blogId);
    console.log("[Comments] Author:", authorName.trim(), "Email:", authorEmail.trim());

    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: commentContent.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[Comments] API error:", data);
        setError(data.message || "Failed to submit comment. Please try again.");
        setDebugInfo(`Error: ${data.message || 'Unknown error'}`);
        return;
      }

      console.log("[Comments] Comment submitted successfully!");
      
      // Show success message
      setSubmitSuccess(true);
      setAuthorName("");
      setAuthorEmail("");
      setCommentContent("");
      setShowForm(false);

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("[Comments] Submission exception:", err);
      setError("Failed to submit comment. Please check your connection and try again.");
      setDebugInfo("Network error: Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  const displayComments = comments.length > 0 ? comments : demoComments;

  return (
    <section className="container-tight py-12">
      <div className="border-t border-border pt-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Comments ({displayComments.length})
            </h3>
            <p className="text-sm text-muted-foreground">
              Join the conversation
            </p>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Comment submitted!</p>
              <p className="text-sm text-green-700">
                Your comment has been submitted and is pending approval. It will appear here once approved by our team.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
              {debugInfo && (
                <details className="mt-2">
                  <summary className="text-xs text-red-600 cursor-pointer">
                    Technical Details
                  </summary>
                  <p className="text-xs text-red-600 mt-1 font-mono">
                    {debugInfo}
                  </p>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Debug Info (Development Only) */}
        {debugInfo && !error && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              Debug Info: {debugInfo}
            </p>
          </div>
        )}

        {/* Comment Form */}
        {showForm ? (
          <div className="bg-card rounded-2xl p-6 border border-border mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-foreground">Leave a Comment</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                  setDebugInfo(null);
                }}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authorName">Your Name *</Label>
                  <Input
                    id="authorName"
                    placeholder="John Doe"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorEmail">Email Address *</Label>
                  <Input
                    id="authorEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commentContent">Your Comment *</Label>
                <Textarea
                  id="commentContent"
                  placeholder="Share your thoughts..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Your comment will be reviewed by an admin before it appears on this page.
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                  setDebugInfo(null);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="coral"
                onClick={handleSubmit}
                disabled={submitting || !authorName.trim() || !authorEmail.trim() || !commentContent.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="mb-8"
            onClick={() => setShowForm(true)}
          >
            <User className="w-4 h-4 mr-2" />
            Write a Comment
          </Button>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-coral" />
            <span className="ml-3 text-muted-foreground">Loading comments...</span>
          </div>
        )}

        {/* Comments List */}
        {!loading && (
          <div className="space-y-6">
            {displayComments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={comment.author_avatar} alt={comment.author_name} />
                  <AvatarFallback className="bg-secondary">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-foreground">
                      {comment.author_name}
                    </span>
                    {comment.isAdmin && (
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                        Author
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Comments Message */}
        {!loading && displayComments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}

        {/* Load More */}
        {!loading && displayComments.length >= 3 && (
          <div className="mt-8 text-center">
            <Button variant="ghost">
              Load More Comments
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;

