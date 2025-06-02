-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_username TEXT NOT NULL UNIQUE,
  github_token TEXT NOT NULL,
  github_avatar TEXT,
  github_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  preview_image TEXT NOT NULL,
  features JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  color_scheme JSONB NOT NULL,
  repositories JSONB NOT NULL,
  template_id TEXT NOT NULL,
  deployment_url TEXT,
  github_pages_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default template
INSERT INTO templates (id, name, description, category, preview_image, features)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Default Portfolio',
  'A clean, modern portfolio template for showcasing your GitHub projects',
  'portfolio',
  '/templates/default.jpg',
  '["Responsive design", "Dark/Light mode", "Project showcase", "GitHub integration"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
BEFORE UPDATE ON portfolios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Templates are public read-only
CREATE POLICY templates_read_policy ON templates
  FOR SELECT USING (true);

-- Users can only read/update their own data
CREATE POLICY users_read_policy ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY users_update_policy ON users
  FOR UPDATE USING (auth.uid() = id);

-- Portfolios can be read by anyone but only updated by the owner
CREATE POLICY portfolios_read_policy ON portfolios
  FOR SELECT USING (true);
  
CREATE POLICY portfolios_insert_policy ON portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY portfolios_update_policy ON portfolios
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY portfolios_delete_policy ON portfolios
  FOR DELETE USING (auth.uid() = user_id);
