# EquiMed Spot MVP

医師スポット募集のMVPアプリケーションです。ヒートマップとマッチング機能を提供します。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseの設定

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQL Editorで以下のスキーマを実行：

```sql
-- 開発用: RLS OFF（本番はONにしてポリシーを設定）
-- extension（UUID生成）
create extension if not exists pgcrypto;

create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  years_of_exp int,
  skills text[],
  ehr_experience text[],
  lat double precision,
  lng double precision,
  rating numeric default 0,
  cancel_rate numeric default 0
);

create table if not exists hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  facility_type text,
  ehr_type text,
  lat double precision,
  lng double precision,
  rating numeric default 0
);

create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid references hospitals(id) on delete cascade,
  dept text,
  role text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  required_skills text[],
  comp_base integer,
  surcharge_factor numeric default 1.0,
  status text default 'open'
);
create index if not exists idx_shifts_status ON shifts(status);
create index if not exists idx_shifts_time ON shifts(start_at, end_at);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete cascade,
  shift_id uuid references shifts(id) on delete cascade,
  score numeric,
  status text default 'applied',
  created_at timestamptz default now()
);
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. ダミーデータの投入

```bash
npm install dotenv
node --env-file=.env.local scripts/seed.mjs
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

## 機能

- **地図表示**: `/map`でヒートマップとピン表示の切り替え
- **API エンドポイント**:
  - `/api/shifts`: 直近72時間のシフト情報をGeoJSON形式で返す
  - `/api/match?doctorId=XXX`: 指定された医師にマッチするシフトをスコア順で返す

## 技術スタック

- Next.js 15 (App Router, TypeScript)
- Supabase (Postgres + Auth)
- maplibre-gl (地図表示)
- Tailwind CSS (スタイリング)
