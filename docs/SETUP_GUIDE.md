# Guia de Configuracao - Supabase + Mercado Pago

Siga este passo a passo para configurar as integracoes do FakeForge BR.

---

## 1. Supabase (Auth + Database)

### 1.1 Criar projeto

1. Acesse https://supabase.com e faca login (ou crie conta com GitHub)
2. Clique em **New Project**
3. Preencha:
   - Organization: sua org (ou crie uma)
   - Name: `fakeforge-br`
   - Database Password: gere uma senha forte e guarde
   - Region: `South America (Sao Paulo)` — importante para latencia
4. Clique **Create new project** e aguarde ~2 minutos

### 1.2 Pegar as chaves

1. No dashboard do projeto, va em **Settings** > **API**
2. Copie:
   - **Project URL** → sera o `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → sera o `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → sera o `SUPABASE_SERVICE_ROLE_KEY` (NUNCA exponha no frontend)

### 1.3 Configurar Auth

1. Va em **Authentication** > **Providers**
2. Ative **Email** (magic link):
   - Enable Email provider: ON
   - Confirm Email: ON
   - Enable Email OTP: ON
3. Ative **GitHub** (opcional mas recomendado):
   - Va em https://github.com/settings/developers
   - Clique **New OAuth App**
   - Application name: `FakeForge BR`
   - Homepage URL: `http://localhost:3000` (mude para producao depois)
   - Authorization callback URL: copie do Supabase (esta na tela do provider GitHub)
   - Copie o **Client ID** e **Client Secret** e cole no Supabase

### 1.4 Criar tabelas no banco

1. Va em **SQL Editor** no Supabase
2. Cole e execute este SQL:

```sql
-- Tabela de API keys dos usuarios
CREATE TABLE api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Tabela de uso da API (tracking)
CREATE TABLE api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  data_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de assinaturas
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'dev', 'team')),
  mp_subscription_id TEXT,
  mp_payer_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies: usuarios so veem seus proprios dados
CREATE POLICY "Users see own api_keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own usage" ON api_usage
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own subscription" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Indice para busca de API key
CREATE INDEX idx_api_keys_key ON api_keys(key) WHERE is_active = true;

-- Indice para uso diario
CREATE INDEX idx_api_usage_daily ON api_usage(api_key_id, created_at);
```

3. Verifique que as 3 tabelas aparecem em **Table Editor**

### 1.5 Configurar URL de redirect

1. Va em **Authentication** > **URL Configuration**
2. Site URL: `http://localhost:3000` (mude para dominio de producao depois)
3. Redirect URLs: adicione `http://localhost:3000/auth/callback`

---

## 2. Mercado Pago

### 2.1 Criar aplicacao

1. Acesse https://www.mercadopago.com.br/developers
2. Faca login com sua conta do Mercado Pago
3. Va em **Suas integracoes** > **Criar aplicacao**
4. Preencha:
   - Nome: `FakeForge BR`
   - Modelo de integracao: **Checkout Pro**
   - Marque os escopos necessarios
5. Clique **Criar aplicacao**

### 2.2 Pegar credenciais

1. Na aplicacao criada, va em **Credenciais de producao**
   (use **Credenciais de teste** enquanto estiver desenvolvendo)
2. Copie:
   - **Public Key** → sera o `NEXT_PUBLIC_MP_PUBLIC_KEY`
   - **Access Token** → sera o `MP_ACCESS_TOKEN`

### 2.3 Configurar webhook (depois do deploy)

1. Na aplicacao, va em **Webhooks**
2. URL de notificacao: `https://seu-dominio.com/api/webhooks/mercadopago`
3. Eventos: marque **payment** e **subscription**
4. Clique salvar

---

## 3. Configurar o .env.local

Crie o arquivo `.env.local` na raiz do projeto com:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Mercado Pago
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxx
MP_ACCESS_TOKEN=APP_USR-xxxx

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**IMPORTANTE:** O arquivo `.env.local` ja esta no `.gitignore`. Nunca commite credenciais.

---

## 4. Testar

```bash
cd C:\Users\evert\OneDrive\Desktop\test-data-generator
npm run dev
```

1. Acesse `http://localhost:3000/login`
2. Teste o login com magic link (email) ou GitHub
3. Acesse `/dashboard` — deve mostrar seu painel com API key
4. Teste o pricing em `/pricing`

---

## Checklist

- [ ] Projeto Supabase criado (regiao Sao Paulo)
- [ ] Chaves copiadas (URL, anon key, service role key)
- [ ] Email provider ativado
- [ ] GitHub OAuth configurado (opcional)
- [ ] SQL executado (3 tabelas criadas)
- [ ] Redirect URL configurada
- [ ] Aplicacao no Mercado Pago criada
- [ ] Credenciais do MP copiadas (public key, access token)
- [ ] Arquivo .env.local criado com todas as chaves
- [ ] `npm run dev` funcionando
- [ ] Login testado
