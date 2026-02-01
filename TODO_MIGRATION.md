# MongoDB Migration - TODO List

## Phase 1: Complete MongoDB Operations ✅ COMPLETED
- [x] Add comments CRUD operations to `src/integrations/mongodb/client.ts`
- [x] Add newsletter subscribers CRUD operations to `src/integrations/mongodb/client.ts`

## Phase 2: Create MongoDB API Routes ✅ COMPLETED
- [x] Create `server/src/index.ts` - Express server with all API routes
- [x] Create API services for frontend in `src/services/api/`
  - `blogs.ts` - Blog API functions
  - `comments.ts` - Comment API functions
  - `newsletter.ts` - Newsletter API functions

## Phase 3: Update Components to Use MongoDB ✅ COMPLETED
- [x] Update `CommentSection.tsx` - Use MongoDB API instead of Supabase
- [x] Update `AdminComments.tsx` - Use MongoDB API instead of Supabase
- [x] Update `useNewsletterSubscribe.ts` - Use MongoDB API
- [x] Update `Blog.tsx` - Use MongoDB API
- [x] Update `BlogDetail.tsx` - Use MongoDB API
- [x] Update `NewsletterForm.tsx` - No changes needed (uses hook)
- [x] Update `src/types/blog.ts` - Made `is_published` optional

## Phase 4: Run Migration (Pending)
- [ ] Run the API server: `cd server && npm install && npm run dev`
- [ ] Run the migration script to transfer data from Supabase to MongoDB (if needed)
- [ ] Set `VITE_API_URL=http://localhost:3001/api` in `.env`

## Phase 5: Cleanup (Optional)
- [ ] Remove Supabase data operations where not needed
- [x] Replace Supabase Auth with MongoDB + JWT for admin authentication ✅
- [ ] Test all functionality

## Setup Instructions

### 1. Start the API Server
```bash
cd server
npm install
npm run dev
```

### 2. Set Environment Variables
Add to `.env`:
```
VITE_API_URL=http://localhost:3001/api
```

### 3. API Endpoints Available

**Blogs:**
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/all` - Get all blogs (admin)
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

**Comments:**
- `GET /api/comments?blogId=xxx` - Get approved comments for a blog
- `POST /api/comments` - Submit new comment
- `GET /api/comments/admin/all` - Get all comments (admin)
- `GET /api/comments/admin/pending` - Get pending comments
- `GET /api/comments/admin/pending/count` - Count pending comments
- `PUT /api/comments/admin/:id/approve` - Approve comment
- `PUT /api/comments/admin/:id/reject` - Reject comment
- `DELETE /api/comments/admin/:id` - Delete comment

**Newsletter:**
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe
- `GET /api/newsletter/admin/subscribers` - Get all subscribers
- `GET /api/newsletter/admin/count` - Count subscribers
- `DELETE /api/newsletter/admin/subscribers/:id` - Delete subscriber

### 4. MongoDB Connection
The API server uses the following MongoDB connection:
- **URI:** `<REDACTED_MONGODB_URI>`  # configure via env (VITE_MONGODB_URI/MONGODB_URI).
- **Database:** `kreative_db`

Collections:
- `blogs` - Blog posts
- `comments` - Comments
- `newsletter_subscribers` - Newsletter subscribers

## Notes
- Supabase Auth is still used for admin authentication in `AdminComments.tsx`
- The migration from Supabase to MongoDB eliminates the PGRST205 error
- Demo comments are shown as fallback when MongoDB is unavailable

