/*
  # Create content_drafts table

  ## Overview
  This migration creates the content_drafts table for storing social media content generation requests. Each draft represents a user's content creation blueprint with all necessary parameters for AI content generation.

  ## New Tables
  
  ### `content_drafts`
  - `id` (uuid, primary key) - Unique identifier for each content draft
  - `user_id` (uuid, foreign key) - References auth.users, identifies the draft owner
  - `created_at` (timestamptz) - Timestamp when the draft was created
  - `idea` (text, not null) - The core content concept/idea provided by the user
  - `platform` (text, not null) - Target social media platform (Facebook, Twitter (X), Instagram)
  - `format` (text, not null) - Desired post format (Text Only, Image + Text, Video Post)
  - `asset_source` (text, nullable) - How assets should be obtained (AI Generate, Upload My Own, or null for Text Only)
  - `knowledge_base_file_name` (text, nullable) - Name of uploaded PDF knowledge base file
  - `asset_file_name` (text, nullable) - Name of uploaded custom asset file
  - `status` (text, default 'draft_created') - Current status of the content draft

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the content_drafts table
  - Users can only view their own content drafts
  - Users can only insert drafts associated with their own user_id
  - Users can only update their own content drafts
  - Users can only delete their own content drafts
  
  ## Indexes
  - Primary index on id
  - Index on user_id for efficient user-specific queries
  - Index on created_at for chronological sorting

  ## Important Notes
  1. All drafts are associated with authenticated users only
  2. The asset_source field is null when format is "Text Only"
  3. File names are stored as text, not full file objects
  4. Default status is 'draft_created' for all new records
*/

-- Create content_drafts table
CREATE TABLE IF NOT EXISTS content_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  idea text NOT NULL,
  platform text NOT NULL,
  format text NOT NULL,
  asset_source text,
  knowledge_base_file_name text,
  asset_file_name text,
  status text DEFAULT 'draft_created' NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS content_drafts_user_id_idx ON content_drafts(user_id);
CREATE INDEX IF NOT EXISTS content_drafts_created_at_idx ON content_drafts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view only their own content drafts
CREATE POLICY "Users can view own content drafts"
  ON content_drafts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert only their own content drafts
CREATE POLICY "Users can insert own content drafts"
  ON content_drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update only their own content drafts
CREATE POLICY "Users can update own content drafts"
  ON content_drafts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete only their own content drafts
CREATE POLICY "Users can delete own content drafts"
  ON content_drafts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);