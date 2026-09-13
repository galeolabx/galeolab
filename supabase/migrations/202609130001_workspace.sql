begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (length(full_name) <= 200),
  company text check (length(company) <= 200),
  phone text check (length(phone) <= 40),
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 120),
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_owner_created on public.projects(user_id, created_at desc);

create table public.project_activities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  created_at timestamptz not null default now()
);
create index activities_owner_created on public.project_activities(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_activities enable row level security;

revoke all on public.profiles, public.projects, public.project_activities from anon, authenticated;
grant select on public.profiles, public.projects, public.project_activities to authenticated;
grant insert (id, full_name, company, phone), update (full_name, company, phone) on public.profiles to authenticated;
grant insert (user_id, name, status, due_date), update (name, status, due_date), delete on public.projects to authenticated;

create policy profiles_read_own on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy profiles_insert_own on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy projects_read_own on public.projects for select to authenticated using ((select auth.uid()) = user_id);
create policy projects_insert_own on public.projects for insert to authenticated with check ((select auth.uid()) = user_id);
create policy projects_update_own on public.projects for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy projects_delete_own on public.projects for delete to authenticated using ((select auth.uid()) = user_id);
create policy activities_read_own on public.project_activities for select to authenticated using ((select auth.uid()) = user_id);

create function public.create_user_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, full_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 200));
  return new;
end;
$$;
revoke all on function public.create_user_profile() from public, anon, authenticated;
create trigger create_user_profile after insert on auth.users
  for each row execute function public.create_user_profile();

-- Backfill real Auth accounts created before this migration, never demo accounts.
insert into public.profiles(id, full_name)
select id, left(coalesce(raw_user_meta_data ->> 'full_name', ''), 200) from auth.users
on conflict (id) do nothing;

create function public.record_project_activity() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    insert into public.project_activities(project_id, user_id, description)
    values (new.id, new.user_id, 'Created project: ' || new.name);
  elsif new.name is distinct from old.name or new.status is distinct from old.status or new.due_date is distinct from old.due_date then
    new.updated_at := now();
    insert into public.project_activities(project_id, user_id, description)
    values (new.id, new.user_id, 'Updated project: ' || new.name);
  end if;
  return new;
end;
$$;
revoke all on function public.record_project_activity() from public, anon, authenticated;
-- INSERT runs after the project exists so the activity foreign key is valid.
create trigger project_created after insert on public.projects
  for each row execute function public.record_project_activity();
create trigger project_updated before update on public.projects
  for each row execute function public.record_project_activity();

commit;
