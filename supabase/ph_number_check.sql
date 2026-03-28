-- Add CHECK constraint to profiles table for PH mobile numbers
ALTER TABLE profiles 
ADD CONSTRAINT check_ph_contact_number 
CHECK (
  contact_number ~ '^09[0-9]{9}$'
);

-- Note: This ensures any name inserted is exactly 11 digits and starts with '09'
