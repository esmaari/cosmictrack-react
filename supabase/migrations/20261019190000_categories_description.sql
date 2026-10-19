-- Optional description for user-managed categories
alter table public.categories
  add column if not exists description text;

comment on column public.categories.description is
  'Optional short description shown on the categories management page';
