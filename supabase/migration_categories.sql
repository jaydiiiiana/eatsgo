-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pre-populate with common categories
INSERT INTO categories (name) VALUES 
  ('Burgers'), 
  ('Pizza'), 
  ('Drinks'), 
  ('Dessert')
ON CONFLICT (name) DO NOTHING;

-- Update Products Table to reference categories
ALTER TABLE products 
ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Migrate existing text categories to category_id
-- This is a one-time migration
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE p.category = c.name;

-- RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
