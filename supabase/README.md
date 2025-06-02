# Supabase Integration for RepoForge

This directory contains the Supabase database schema and setup instructions for the RepoForge application.

## Overview

RepoForge uses Supabase to store:
- User information (GitHub tokens, usernames)
- Portfolio data (repositories, color schemes, templates)
- Template information

## Setup Instructions

### 1. Create a Supabase Project

1. Sign up or log in at [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key (public API key)

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Initialize Database Schema

You can run the schema.sql file in the Supabase SQL Editor to set up your database tables:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a "New Query"
4. Copy and paste the contents of `schema.sql` into the editor
5. Run the query

## Database Schema

### Users Table
Stores GitHub user information and authentication tokens.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| github_username | TEXT | GitHub username (unique) |
| github_token | TEXT | GitHub Personal Access Token |
| github_avatar | TEXT | URL to GitHub avatar |
| github_name | TEXT | User's name from GitHub |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Templates Table
Stores portfolio template information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Template name |
| description | TEXT | Template description |
| category | TEXT | Template category (portfolio, blog, etc.) |
| preview_image | TEXT | URL to preview image |
| features | JSONB | Array of template features |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Portfolios Table
Stores user portfolio data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users table |
| name | TEXT | Portfolio name |
| description | TEXT | Portfolio description |
| color_scheme | JSONB | Color scheme data |
| repositories | JSONB | Array of GitHub repositories |
| template_id | TEXT | Template identifier |
| deployment_url | TEXT | URL to deployed portfolio |
| github_pages_url | TEXT | URL to GitHub Pages deployment |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Row Level Security (RLS)

The schema includes Row Level Security policies to ensure:
- Users can only access and modify their own data
- Templates are read-only for all users
- Portfolios can be read by anyone but only modified by their owners

## Using the Supabase Client

The application uses the Supabase client from `@/utils/supabase.ts` to interact with the database. This includes functions for:
- Saving and retrieving user data
- Managing portfolio information
- Accessing template data

For more information on using Supabase with Next.js, see the [Supabase Next.js documentation](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs).
