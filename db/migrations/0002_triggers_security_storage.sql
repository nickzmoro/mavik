create or replace function public.create_profile_for_user(
  p_user_id uuid,
  p_email text,
  p_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_full_name text := left(
    coalesce(
      nullif(trim(p_metadata->>'full_name'), ''),
      nullif(trim(p_metadata->>'name'), ''),
      nullif(split_part(coalesce(p_email, ''), '@', 1), ''),
      ''
    ),
    120
  );
  v_avatar_url text := coalesce(p_metadata->>'avatar_url', p_metadata->>'picture');
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    p_user_id,
    v_full_name,
    case when v_avatar_url ~ '^https://' then v_avatar_url end
  )
  on conflict (id) do nothing;
end;
$$;
--> statement-breakpoint
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.create_profile_for_user(new.id, new.email, new.raw_user_meta_data);
  return new;
end;
$$;
--> statement-breakpoint
drop trigger if exists on_auth_user_created on auth.users;
--> statement-breakpoint
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
--> statement-breakpoint
select public.create_profile_for_user(u.id, u.email, u.raw_user_meta_data)
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
--> statement-breakpoint
create or replace function public.add_store_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.store_members (store_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict (store_id, user_id) do update set role = 'owner';
  return new;
end;
$$;
--> statement-breakpoint
create trigger on_store_created
  after insert on public.stores
  for each row execute function public.add_store_owner();
--> statement-breakpoint
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
--> statement-breakpoint
create trigger contents_touch
  before update on public.contents
  for each row execute function public.touch_updated_at();
--> statement-breakpoint
create trigger store_positioning_touch
  before update on public.store_positioning
  for each row execute function public.touch_updated_at();
--> statement-breakpoint
create or replace function public.log_content_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.content_status_history (content_id, from_status, to_status, changed_by)
    values (
      new.id,
      case when tg_op = 'UPDATE' then old.status end,
      new.status,
      (select auth.uid())
    );
  end if;
  return new;
end;
$$;
--> statement-breakpoint
create trigger contents_status_log
  after insert or update of status on public.contents
  for each row execute function public.log_content_status();
--> statement-breakpoint
create or replace function public.storage_object_store_id(p_object_name text)
returns uuid
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_folder text := (storage.foldername(p_object_name))[1];
begin
  if v_folder ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return v_folder::uuid;
  end if;

  return null;
end;
$$;
--> statement-breakpoint
revoke all on function public.create_profile_for_user(uuid, text, jsonb) from public, anon, authenticated;
--> statement-breakpoint
revoke all on function public.handle_new_user() from public, anon, authenticated;
--> statement-breakpoint
revoke all on function public.add_store_owner() from public, anon, authenticated;
--> statement-breakpoint
revoke all on function public.touch_updated_at() from public, anon, authenticated;
--> statement-breakpoint
revoke all on function public.log_content_status() from public, anon, authenticated;
--> statement-breakpoint
revoke all on function public.storage_object_store_id(text) from public, anon;
--> statement-breakpoint
grant execute on function public.storage_object_store_id(text) to authenticated, service_role;
--> statement-breakpoint
revoke all on all tables in schema public from anon;
--> statement-breakpoint
revoke all on all sequences in schema public from anon;
--> statement-breakpoint
alter default privileges for role postgres in schema public revoke all on tables from anon;
--> statement-breakpoint
alter default privileges for role postgres in schema public revoke all on sequences from anon;
--> statement-breakpoint
alter default privileges for role postgres in schema public revoke execute on functions from anon, public;
--> statement-breakpoint
revoke truncate, references, trigger on all tables in schema public from authenticated;
--> statement-breakpoint
revoke insert, update, delete on public.store_art_usage from authenticated;
--> statement-breakpoint
revoke update on public.profiles from authenticated;
--> statement-breakpoint
grant update (full_name, avatar_url, marketing_level, theme) on public.profiles to authenticated;
--> statement-breakpoint
revoke update on public.notifications from authenticated;
--> statement-breakpoint
grant update (read_at) on public.notifications to authenticated;
--> statement-breakpoint
revoke update on public.stores from authenticated;
--> statement-breakpoint
grant update (
  name, slug, segment, city, state, serves_online, website_url, instagram_handle,
  main_goal, current_objective, focus_weekdays, is_regulated, onboarding_step,
  onboarding_completed_at
) on public.stores to authenticated;
--> statement-breakpoint
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'brand-assets',
    'brand-assets',
    false,
    20971520,
    array[
      'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
      'font/ttf', 'font/otf', 'font/woff', 'font/woff2',
      'application/pdf'
    ]
  ),
  (
    'artworks',
    'artworks',
    false,
    10485760,
    array['image/png', 'image/jpeg', 'image/webp']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
--> statement-breakpoint
create policy "membros leem arquivos da loja" on storage.objects
  for select to authenticated
  using (
    bucket_id in ('brand-assets', 'artworks')
    and public.is_store_member(public.storage_object_store_id(name))
  );
--> statement-breakpoint
create policy "dono gerencia arquivos da marca" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'brand-assets'
    and public.is_store_owner(public.storage_object_store_id(name))
  )
  with check (
    bucket_id = 'brand-assets'
    and public.is_store_owner(public.storage_object_store_id(name))
  );
--> statement-breakpoint
create policy "membros gerenciam artes" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'artworks'
    and public.is_store_member(public.storage_object_store_id(name))
  )
  with check (
    bucket_id = 'artworks'
    and public.is_store_member(public.storage_object_store_id(name))
  );
