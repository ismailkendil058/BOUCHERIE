-- Fix RLS policy on user_roles to allow users to view their own role
-- This is needed for the login function to work properly

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Admins can view user_roles" ON public.user_roles;

-- Create a new policy that allows authenticated users to view their own roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Also allow authenticated users to view all roles (needed for admin check during login)
CREATE POLICY "Authenticated users can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);
