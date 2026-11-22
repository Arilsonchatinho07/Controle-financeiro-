-- Execute no SQL Editor do Supabase
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
create index if not exists transacoes_house_idx on transacoes(house);
alter table transacoes enable row level security;
-- Acesso simples por código da casa (o código funciona como "palavra-passe"). Use um código longo e difícil.
create policy "acesso anon" on transacoes for all to anon using (true) with check (true);
alter publication supabase_realtime add table transacoes;
