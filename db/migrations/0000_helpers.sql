create or replace function public.is_store_member(p_store_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.store_members m
    where m.store_id = p_store_id
      and m.user_id = (select auth.uid())
  );
end;
$$;
--> statement-breakpoint
create or replace function public.is_store_owner(p_store_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.store_members m
    where m.store_id = p_store_id
      and m.user_id = (select auth.uid())
      and m.role = 'owner'
  );
end;
$$;
--> statement-breakpoint
create or replace function public.shares_store_with(p_user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.store_members mine
    join public.store_members theirs on theirs.store_id = mine.store_id
    where mine.user_id = (select auth.uid())
      and theirs.user_id = p_user_id
  );
end;
$$;
--> statement-breakpoint
revoke all on function public.is_store_member(uuid) from public, anon;
--> statement-breakpoint
revoke all on function public.is_store_owner(uuid) from public, anon;
--> statement-breakpoint
revoke all on function public.shares_store_with(uuid) from public, anon;
--> statement-breakpoint
grant execute on function public.is_store_member(uuid) to authenticated, service_role;
--> statement-breakpoint
grant execute on function public.is_store_owner(uuid) to authenticated, service_role;
--> statement-breakpoint
grant execute on function public.shares_store_with(uuid) to authenticated, service_role;
