-- Execute no SQL Editor do Supabase (pode executar mais de uma vez)
create table if not exists transacoes (
  id text primary key,
  house text not null,
  type text not null check (type in ('in','out')),
  amount numeric not null,
  cat text not null,
  pay text not null check (pay in ('cash','mcx')),
  at bigint not null,
  note text default '',
  by_name text default '',
  deleted boolean default false,
  updated_at bigint not null
);
-- cada linha pertence à conta que a criou
alter table transacoes add column if not exists user_id uuid default auth.uid();
create index if not exists transacoes_user_house_idx on transacoes(user_id, house);
alter table transacoes enable row level security;
drop policy if exists "acesso anon" on transacoes;
drop policy if exists "so a minha conta" on transacoes;
create policy "so a minha conta" on transacoes for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
-- tempo real
do $$ begin
  alter publication supabase_realtime add table transacoes;
exception when duplicate_object then null; end $$;
