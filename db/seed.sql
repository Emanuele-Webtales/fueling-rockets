-- Seed minimal data for Fueling Rockets MVP
-- Run AFTER schema.sql in the Supabase SQL editor.

-- 1) Ensure there is at least one published lesson
insert into public.lessons (slug, title, metadata_json, version, status)
values (
  'algebra-integers-ops',
  'Integers & Operations',
  '{"estimatedMinutes":12}'::jsonb,
  1,
  'published'
)
on conflict (slug) do update set status = excluded.status
returning id into strict _lesson_id;

-- 2) Basic activities if none exist yet
do $$
declare
  _lesson uuid;
  _count int;
begin
  select id into _lesson from public.lessons where slug = 'algebra-integers-ops' limit 1;
  select count(*) into _count from public.activities where lesson_id = _lesson;
  if _lesson is not null and _count = 0 then
    insert into public.activities (lesson_id, section_index, type, config_json) values
    (_lesson, 0, 'mcq', '{"prompt":"Which equals -3 + 5?","choices":["-8","2","-2","8"],"correctIndex":1,"rationales":["","Adding 5 to -3 gives 2","",""]}'),
    (_lesson, 1, 'notebook_gate', '{"prompt":"In your notebook, compute 12 - 19. Show steps.","reflection":{"placeholder":"Write what you noticed…"}}'),
    (_lesson, 2, 'short_answer', '{"prompt":"Solve: x + 7 = 12","rubric":["Shows inverse operation","States x = 5"],"answer":"5"}');
  end if;
end $$;

-- 3) Create a demo class for the first teacher profile (if any)
do $$
declare
  _teacher uuid;
  _exists boolean;
begin
  select id into _teacher from public.profiles where role in ('teacher','admin') order by created_at asc limit 1;
  if _teacher is not null then
    select exists(select 1 from public.classes where name = 'Demo Class') into _exists;
    if not _exists then
      insert into public.classes (name, teacher_id, join_code) values ('Demo Class', _teacher, 'FRDEMO');
    end if;
  end if;
end $$;


