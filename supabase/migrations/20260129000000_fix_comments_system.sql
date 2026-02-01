-- Migration: Fix Comments System
-- This migration addresses issues preventing users from posting comments
-- Run this after the initial comments_table migration

-- Step 1: Add missing author_avatar field to comments table
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS author_avatar TEXT;

-- Step 2: Create the update_updated_at_column() function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create has_role() function for RLS policies
-- This function checks if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id UUID,
  _role TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role::public.app_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Recreate RLS policies with proper anonymous access
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can update comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON public.comments;

-- Create RLS policy: Anyone can view approved comments
-- This allows public users to see approved comments
CREATE POLICY "Anyone can view approved comments"
ON public.comments
FOR SELECT
USING (is_approved = true);

-- Create RLS policy: Anyone can insert comments (for new submissions)
-- WITH CHECK (true) means any user (including anonymous) can insert
-- The application handles validation before insertion
CREATE POLICY "Anyone can insert comments"
ON public.comments
FOR INSERT
WITH CHECK (true);

-- Create RLS policy: Authenticated admins can view all comments
CREATE POLICY "Admins can view all comments"
ON public.comments
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

-- Create RLS policy: Authenticated admins can update comments
CREATE POLICY "Admins can update comments"
ON public.comments
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

-- Create RLS policy: Authenticated admins can delete comments
CREATE POLICY "Admins can delete comments"
ON public.comments
FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

-- Step 5: Update indexes for better performance
-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_comments_blog_id_approved;
DROP INDEX IF EXISTS idx_comments_pending_approval;

-- Create index for faster queries on approved comments
CREATE INDEX idx_comments_blog_id_approved 
ON public.comments(blog_id, is_approved) 
WHERE is_approved = true;

-- Create index for admin moderation queries
CREATE INDEX idx_comments_pending_approval 
ON public.comments(created_at) 
WHERE is_approved = false;

-- Create index on blog_id for faster comment lookups
CREATE INDEX IF NOT EXISTS idx_comments_blog_id 
ON public.comments(blog_id);

-- Create index on author_email for spam prevention lookups
CREATE INDEX IF NOT EXISTS idx_comments_author_email 
ON public.comments(author_email);

-- Step 6: Add comment explaining the anonymous access
COMMENT ON POLICY "Anyone can insert comments" ON public.comments IS 
'Allows anonymous and authenticated users to submit comments. Comments require admin approval before becoming visible.';

