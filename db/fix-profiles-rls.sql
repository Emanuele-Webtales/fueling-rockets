-- Fix missing INSERT policy for profiles table
-- Run this in Supabase SQL Editor

-- Add INSERT policy for profiles (users can create their own profile)
drop policy if exists profiles_self_insert on public.profiles;
create policy profiles_self_insert on public.profiles
for insert with check (id = auth.uid());

-- Verify the policy was created
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies 
where tablename = 'profiles' 
order by policyname;
