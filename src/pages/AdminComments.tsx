import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, 
  X, 
  Trash2, 
  MessageCircle, 
  Loader2, 
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { getAllComments, approveComment, rejectComment, deleteComment } from "@/services/api/comments";

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
}

// API URL - change this to your server URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AdminComments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin via local JWT token
  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/admin/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          navigate('/auth');
          return;
        }
        setIsAdmin(true);
      } catch (err) {
        console.error('Failed to verify admin token', err);
        navigate('/auth');
      }
    };

    checkAdminStatus();
  }, [navigate]);

  // Fetch all comments (including unapproved for admin) from MongoDB API
  const fetchComments = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      const data = await getAllComments();
      setComments(data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchComments();
    }
  }, [isAdmin]);

  const handleApprove = async (commentId: string) => {
    if (!commentId) return;
    
    setProcessingIds(prev => new Set(prev).add(commentId));
    
    try {
      await approveComment(commentId);
      setComments(prev => 
        prev.map(c => c.id === commentId ? { ...c, is_approved: true } : c)
      );
    } catch (err) {
      console.error("Failed to approve comment:", err);
      setError("Failed to approve comment");
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const handleReject = async (commentId: string) => {
    if (!commentId) return;
    
    setProcessingIds(prev => new Set(prev).add(commentId));
    
    try {
      await rejectComment(commentId);
      setComments(prev => 
        prev.map(c => c.id === commentId ? { ...c, is_approved: false } : c)
      );
    } catch (err) {
      console.error("Failed to reject comment:", err);
      setError("Failed to reject comment");
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!commentId) return;
    
    if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      return;
    }

    setProcessingIds(prev => new Set(prev).add(commentId));
    
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError("Failed to delete comment");
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  // Filter and search comments
  const filteredComments = comments.filter(comment => {
    // Filter by status
    if (filter === "pending" && comment.is_approved) return false;
    if (filter === "approved" && !comment.is_approved) return false;

    // Search by author name or content
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        comment.author_name.toLowerCase().includes(search) ||
        comment.content.toLowerCase().includes(search)
      );
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pendingCount = comments.filter(c => !c.is_approved).length;

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-tight py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Comment Moderation</h1>
            <p className="text-muted-foreground mt-1">
              Manage and approve comments on your blog posts
            </p>
          </div>
{pendingCount > 0 && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100/80 text-sm">
              {pendingCount} pending approval
            </Badge>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search comments..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => {
                    setFilter("all");
                    setCurrentPage(1);
                  }}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  All ({comments.length})
                </Button>
                <Button
                  variant={filter === "pending" ? "secondary" : "outline"}
                  onClick={() => {
                    setFilter("pending");
                    setCurrentPage(1);
                  }}
                  className={`gap-2 ${filter === "pending" ? "border-yellow-500 text-yellow-600 hover:text-yellow-600" : ""}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Pending ({pendingCount})
                </Button>
                <Button
                  variant={filter === "approved" ? "outline" : "outline"}
                  onClick={() => {
                    setFilter("approved");
                    setCurrentPage(1);
                  }}
                  className={`gap-2 ${filter === "approved" ? "bg-green-100 border-green-500 text-green-700 hover:bg-green-100/80 hover:text-green-700" : ""}`}
                >
                  <Check className="w-4 h-4" />
                  Approved ({comments.filter(c => c.is_approved).length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments
            </CardTitle>
            <CardDescription>
              {filteredComments.length} comment{filteredComments.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-coral" />
                <span className="ml-3 text-muted-foreground">Loading comments...</span>
              </div>
            ) : paginatedComments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No comments found</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedComments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                  {comment.author_name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{comment.author_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {comment.author_email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="max-w-xs text-sm truncate">
                              {comment.content}
                            </p>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(comment.created_at), "MMM d, yyyy")}
                            </span>
                          </TableCell>
                          <TableCell>
                            {comment.is_approved ? (
                              <Badge className="gap-1 bg-green-100 text-green-800 border-green-200 hover:bg-green-100/80">
                                <Check className="w-3 h-3" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {comment.is_approved ? (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleReject(comment.id || '')}
                                  disabled={processingIds.has(comment.id || '')}
                                  title="Reject (hide)"
                                >
                                  {processingIds.has(comment.id || '') ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <X className="w-4 h-4" />
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleApprove(comment.id || '')}
                                  disabled={processingIds.has(comment.id || '')}
                                  className="text-green-600 hover:text-green-700"
                                  title="Approve"
                                >
                                  {processingIds.has(comment.id || '') ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDelete(comment.id || '')}
                                disabled={processingIds.has(comment.id || '')}
                                className="text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                {processingIds.has(comment.id || '') ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminComments;

