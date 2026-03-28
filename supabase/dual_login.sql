-- 1. Create a secure function to lookup an email by phone number
CREATE OR REPLACE FUNCTION get_email_by_phone(phone TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as the superuser to safely access auth.users
AS $$
BEGIN
  RETURN (
    SELECT email 
    FROM auth.users 
    JOIN public.profiles ON auth.users.id = public.profiles.id 
    WHERE public.profiles.contact_number = phone 
    LIMIT 1
  );
END;
$$;

-- 2. Allow any user (even logged out) to call this function for login
GRANT EXECUTE ON FUNCTION get_email_by_phone(TEXT) TO anon, authenticated;
