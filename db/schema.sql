-- Fueling Rockets - Minimal MVP Schema
-- Run this in Supabase SQL editor (or via Supabase CLI) against your project.
-- Assumes pgcrypto available for gen_random_uuid(); on Supabase it is.

-- 1) Profiles linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student','teacher','admin')),
  display_name text,
  locale text default 'en',
  created_at timestamptz not null default now()
);

-- Auto-create profile row on auth sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, display_name)
  values (new.id, 'student', coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 2) Classes and enrollments
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  join_code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  user_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  role text not null default 'student' check (role in ('student','teacher')),
  primary key (user_id, class_id)
);

-- 3) Lessons and activities
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  metadata_json jsonb default '{}'::jsonb,
  version int not null default 1,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  section_index int not null,
  type text not null,
  config_json jsonb not null
);

-- 4) Submissions and progress
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  attempt_no int not null default 1,
  response_json jsonb not null,
  is_correct boolean,
  score numeric,
  time_ms int,
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  last_activity_ref uuid,
  percent_complete numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.class_assignments (
  class_id uuid not null references public.classes(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  due_at timestamptz,
  primary key (class_id, lesson_id)
);

-- Basic indexes
create index if not exists idx_enrollments_class on public.enrollments(class_id);
create index if not exists idx_activities_lesson on public.activities(lesson_id);
create index if not exists idx_submissions_user on public.submissions(user_id);
create index if not exists idx_progress_user on public.progress(user_id);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.enrollments enable row level security;
alter table public.lessons enable row level security;
alter table public.activities enable row level security;
alter table public.submissions enable row level security;
alter table public.progress enable row level security;
alter table public.class_assignments enable row level security;

-- Helper: is_teacher() quick check
create or replace function public.is_teacher() returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher','admin')
  );
$$;

-- Profiles: user can read/update own profile
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
for select using (id = auth.uid());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update using (id = auth.uid());

-- Classes: teacher owns class; students can read classes they are enrolled in
drop policy if exists classes_teacher_full on public.classes;
create policy classes_teacher_full on public.classes
for all using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

drop policy if exists classes_student_read on public.classes;
create policy classes_student_read on public.classes
for select using (exists(
  select 1 from public.enrollments e where e.class_id = classes.id and e.user_id = auth.uid()
));

-- Enrollments: user sees their rows; teacher sees their class enrollments
drop policy if exists enroll_self_select on public.enrollments;
create policy enroll_self_select on public.enrollments
for select using (user_id = auth.uid());

drop policy if exists enroll_teacher_select on public.enrollments;
create policy enroll_teacher_select on public.enrollments
for select using (exists(
  select 1 from public.classes c where c.id = enrollments.class_id and c.teacher_id = auth.uid()
));

-- Lessons: allow read of published to all authenticated; teachers/admin can read all
drop policy if exists lessons_read_published on public.lessons;
create policy lessons_read_published on public.lessons
for select using (
  auth.role() = 'authenticated' and (status = 'published' or public.is_teacher())
);

-- Activities: readable if lesson is readable
drop policy if exists activities_read on public.activities;
create policy activities_read on public.activities
for select using (exists(
  select 1 from public.lessons l where l.id = activities.lesson_id and (l.status = 'published' or public.is_teacher())
));

-- Submissions: user can read/write own; teacher can read for their classes' students
drop policy if exists submissions_self_rw on public.submissions;
create policy submissions_self_rw on public.submissions
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists submissions_teacher_read on public.submissions;
create policy submissions_teacher_read on public.submissions
for select using (exists(
  select 1 from public.enrollments e
  join public.classes c on c.id = e.class_id
  join public.activities a on a.id = submissions.activity_id
  join public.lessons l on l.id = a.lesson_id
  where e.user_id = submissions.user_id and c.teacher_id = auth.uid()
));

-- Progress: same model as submissions
drop policy if exists progress_self_rw on public.progress;
create policy progress_self_rw on public.progress
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists progress_teacher_read on public.progress;
create policy progress_teacher_read on public.progress
for select using (exists(
  select 1 from public.enrollments e
  join public.classes c on c.id = e.class_id
  where e.user_id = progress.user_id and c.teacher_id = auth.uid()
));

-- Class assignments: teacher only
drop policy if exists class_assignments_teacher_rw on public.class_assignments;
create policy class_assignments_teacher_rw on public.class_assignments
for all using (exists(
  select 1 from public.classes c where c.id = class_assignments.class_id and c.teacher_id = auth.uid()
)) with check (exists(
  select 1 from public.classes c where c.id = class_assignments.class_id and c.teacher_id = auth.uid()
));


