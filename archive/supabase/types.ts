// Copied from src/integrations/supabase/types.ts
// (Full file retained for archival purposes)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ... (rest of file omitted in archive to keep repository small)
