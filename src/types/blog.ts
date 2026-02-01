export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  author: string;
  author_bio?: string | null;
  author_avatar?: string | null;
  author_twitter?: string | null;
  author_linkedin?: string | null;
  category: string | null;
  read_time: string | null;
  published_at: string | null;
  created_at: string;
  is_featured: boolean;
  is_published?: boolean;
  tags?: string[];
}

export interface Author {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  role?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface RecentPost {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  published_at: string | null;
  read_time: string | null;
}

export interface ArticleNavigation {
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}

export interface Comment {
  id: string;
  blog_id: string;
  author_name: string;
  author_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommentWithAuthor extends Omit<Comment, 'author_email'> {
  author_avatar?: string;
  isAdmin?: boolean;
}

export interface CommentSubmission {
  blogId: string;
  authorName: string;
  authorEmail: string;
  content: string;
}

