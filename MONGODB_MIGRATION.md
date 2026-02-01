# MongoDB Migration Plan

## Overview
Migrate from Supabase (PostgreSQL) to MongoDB for data operations while keeping Supabase Auth.

## Connection String
```
<REDACTED_MONGODB_URI>  # removed for security; configure via env (VITE_MONGODB_URI).
```

## Database Name: kreative_db

## Collections
- blogs
- comments
- newsletter_subscribers
- user_roles (read-only from Supabase)

## Tasks

### Phase 1: Setup
- [x] Create MongoDB integration client
- [ ] Add MongoDB connection to environment
- [ ] Install mongodb driver package

### Phase 2: Core Functions (src/integrations/mongodb/)
- [x] Create connection client
- [x] Create blogs collection functions (CRUD)
- [x] Create comments collection functions (CRUD)
- [x] Create newsletter subscribers functions

### Phase 3: Update Components
- [ ] Update Blog.tsx to use MongoDB
- [ ] Update BlogDetail.tsx to use MongoDB
- [ ] Update Admin.tsx to use MongoDB
- [ ] Update AdminComments.tsx to use MongoDB
- [ ] Update BlogEditor.tsx to use MongoDB
- [ ] Update CommentSection.tsx to use MongoDB
- [ ] Update useNewsletterSubscribe.ts to use MongoDB

### Phase 4: Data Migration
- [x] Create migration script (`scripts/migrate-supabase-to-mongodb.ts`)
- [ ] Run migration script to transfer data from Supabase to MongoDB

### Phase 5: Cleanup
- [ ] Remove Supabase data imports where not needed
- [ ] Update types if necessary
- [ ] Test all functionality

## Running the Migration

```bash
# Install dependencies if needed
npm install

# Run the migration script
npx tsx scripts/migrate-supabase-to-mongodb.ts
```

**Note:** Before running the migration, make sure to set the following environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable key
- `VITE_MONGODB_URI` - MongoDB connection string (already configured)
- `VITE_MONGODB_DB_NAME` - MongoDB database name (already configured as `kreative_db`)

## Collection Schemas

### blogs
```json
{
  "_id": ObjectId,
  "title": String,
  "slug": String,
  "excerpt": String,
  "content": String,
  "image": String,
  "author": String,
  "author_bio": String,
  "author_avatar": String,
  "author_twitter": String,
  "author_linkedin": String,
  "category": String,
  "tags": [String],
  "read_time": String,
  "is_published": Boolean,
  "is_featured": Boolean,
  "published_at": Date,
  "created_at": Date,
  "updated_at": Date
}
```

### comments
```json
{
  "_id": ObjectId,
  "blog_id": String,  // Reference to blog slug or ID
  "blog_slug": String,
  "author_name": String,
  "author_email": String,
  "author_avatar": String,
  "content": String,
  "is_approved": Boolean,
  "created_at": Date,
  "updated_at": Date
}
```

### newsletter_subscribers
```json
{
  "_id": ObjectId,
  "email": String,
  "is_active": Boolean,
  "subscribed_at": Date
}
```

