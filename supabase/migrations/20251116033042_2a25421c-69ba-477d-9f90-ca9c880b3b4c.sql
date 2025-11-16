-- Add INSERT policy for profiles table to allow trigger to insert new user profiles
CREATE POLICY "Allow insert via trigger for profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- Ensure the trigger exists (recreate if needed)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();