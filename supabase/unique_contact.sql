-- Add UNIQUE constraint to contact_number
ALTER TABLE profiles ADD CONSTRAINT unique_contact_number UNIQUE (contact_number);
