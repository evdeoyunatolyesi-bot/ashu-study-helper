-- ASHU STUDY HELPER schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text, academic_level text, avatar_url text, subjects text[] default '{}',
 available_study_hours numeric default 2, academic_goals text, preferred_schedule jsonb default '{}',
 timezone text default 'Asia/Kolkata', language text default 'en', created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.subjects (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, color text default '#8b5cf6', target_hours numeric default 0, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.timetable_events (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, event_date date not null, start_time time not null, end_time time not null,
 subject text, event_type text default 'Study', notes text, recurring_rule jsonb,
 created_at timestamptz default now(), updated_at timestamptz default now(), check(end_time > start_time)
);
create table if not exists public.tasks (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, description text, subject text, category text default 'Homework', priority text default 'Medium',
 due_date date, due_time time, estimated_minutes integer, status text default 'pending', notes text,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.subtasks (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 task_id uuid not null references public.tasks(id) on delete cascade, title text not null, is_completed boolean default false,
 created_at timestamptz default now()
);
create table if not exists public.study_sessions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 subject text, duration_minutes integer not null default 0, started_at timestamptz not null default now(),
 ended_at timestamptz, session_type text default 'focus', notes text, created_at timestamptz default now()
);
create table if not exists public.study_rules (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, description text, frequency text default 'Daily', is_active boolean default true,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.rule_logs (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 rule_id uuid not null references public.study_rules(id) on delete cascade, log_date date not null default current_date,
 is_completed boolean default false, unique(rule_id,log_date)
);
create table if not exists public.habits (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, description text, frequency text default 'Daily', target_count integer default 1,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.habit_logs (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 habit_id uuid not null references public.habits(id) on delete cascade, log_date date not null default current_date,
 count integer default 1, is_completed boolean default true, unique(habit_id,log_date)
);
create table if not exists public.examinations (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, subject text, exam_date date not null, total_marks numeric, notes text,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.syllabus_topics (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 examination_id uuid references public.examinations(id) on delete cascade, title text not null,
 is_completed boolean default false, created_at timestamptz default now()
);
create table if not exists public.notes (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, subject text, chapter text, content text, tags text, is_important boolean default false,
 file_url text, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.flashcards (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 question text not null, answer text not null, subject text, difficulty text default 'Medium',
 last_reviewed_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.quizzes (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, subject text, description text, time_limit_minutes integer,
 questions jsonb default '[]', created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.quiz_attempts (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 quiz_id uuid references public.quizzes(id) on delete set null, score numeric, total_questions integer,
 answers jsonb default '[]', completed_at timestamptz default now()
);
create table if not exists public.notifications (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, body text, notification_type text, scheduled_at timestamptz,
 is_read boolean default false, created_at timestamptz default now()
);

-- RLS: users can only access rows bearing their own auth uid.
do $$ declare t text; begin
 foreach t in array array['subjects','timetable_events','tasks','subtasks','study_sessions','study_rules','rule_logs','habits','habit_logs','examinations','syllabus_topics','notes','flashcards','quizzes','quiz_attempts','notifications'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('drop policy if exists owner_all on public.%I',t);
  execute format('create policy owner_all on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',t);
 end loop;
 alter table public.profiles enable row level security;
 drop policy if exists owner_all on public.profiles;
 create policy owner_all on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
end $$;

-- Auto-create a profile on sign-up.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,full_name) values(new.id,new.raw_user_meta_data->>'full_name') on conflict(id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create index if not exists tasks_user_due_idx on public.tasks(user_id,due_date);
create index if not exists timetable_user_date_idx on public.timetable_events(user_id,event_date);
create index if not exists sessions_user_started_idx on public.study_sessions(user_id,started_at desc);
create index if not exists exams_user_date_idx on public.examinations(user_id,exam_date);
