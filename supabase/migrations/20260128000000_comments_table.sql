-- Create comments table for blog post comments
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS policy: Anyone can view approved comments
CREATE POLICY "Anyone can view approved comments"
ON public.comments
FOR SELECT
USING (is_approved = true);

-- RLS policy: Anyone can insert comments (for new submissions)
CREATE POLICY "Anyone can insert comments"
ON public.comments
FOR INSERT
WITH CHECK (true);

-- RLS policy: Admins can view all comments (including unapproved)
CREATE POLICY "Admins can view all comments"
ON public.comments
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy: Admins can update comments (for approval/rejection)
CREATE POLICY "Admins can update comments"
ON public.comments
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policy: Admins can delete comments
CREATE POLICY "Admins can delete comments"
ON public.comments
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries on approved comments
CREATE INDEX idx_comments_blog_id_approved 
ON public.comments(blog_id, is_approved) 
WHERE is_approved = true;

-- Create index for admin moderation queries
CREATE INDEX idx_comments_pending_approval 
ON public.comments(created_at) 
WHERE is_approved = false;

