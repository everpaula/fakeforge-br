# AdSense Setup

Guia pro Everton habilitar Google AdSense no FakeForge.

## Status atual (2026-09-18)

- ✅ Script AdSense já wired no `layout.tsx` (só carrega quando env var estiver setada)
- ✅ Component `<AdBanner>` criado em `src/components/AdBanner.tsx`
- ✅ `public/ads.txt` criado (vazio, preencher após aprovação)
- ✅ Placements manuais em: `/gerador-cpf`, `/gerador-cnpj`, `/gerador-cartao`

## Passos manuais que você precisa fazer

### 1. Solicitar aprovação AdSense (5 min + 1-7 dias espera)

1. Ir em https://www.google.com/adsense/start/
2. Sign up com `evertonsilvapaula@gmail.com`
3. Site: `fakeforge.com.br`
4. País: Brasil
5. Aceitar termos e submit
6. Google vai verificar o site (crawler + review manual)
7. **Timeline:** 1-7 dias pra aprovação (às vezes até 2 semanas)

**Requisitos que já batemos:**
- ✅ Domínio owned há tempo suficiente
- ✅ Conteúdo original substancial (135+ pages)
- ✅ Tráfego real (5k+ visitantes/mês)
- ✅ Privacy policy existe (`/privacidade`)
- ✅ Sem violação de direitos autorais

**Possível problema:** AdSense às vezes reprova sites de "dado sintético" temendo uso indevido. Se rejeitar, apelar explicando:
> "FakeForge gera dados brasileiros sintéticos (CPF/CNPJ/PIX/cartão) matematicamente para testes de software.
> Todos os dados são fictícios e não correspondem a pessoas reais. Ferramenta popular entre devs BR
> (5000+ visitantes únicos/mês). Use case é análogo ao Faker.js."

### 2. Após aprovação: pegar Publisher ID e Slot ID

1. Login em https://www.google.com/adsense/
2. Publisher ID: **Account → Account information** — tá em formato `pub-XXXXXXXXXXXXXXXX`
3. Criar Ad Unit:
   - **Ads → By ad unit → Display ads**
   - Name: `fakeforge-default`
   - Size: **Responsive**
   - Click "Create"
   - Copia o `data-ad-slot="XXXXXXXXXX"` (10 dígitos)

### 3. Configurar env vars no Vercel

Vercel Dashboard → fakeforge-br project → Settings → Environment Variables

Adicionar:

```
NEXT_PUBLIC_ADSENSE_CLIENT = ca-pub-XXXXXXXXXXXXXXXX   ← seu Publisher ID (com prefixo ca-)
NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT = XXXXXXXXXX          ← Slot ID (só dígitos)
```

Apply pra **Production**. Redeploy vai puxar as novas envs.

### 4. Atualizar `public/ads.txt`

Depois de aprovado, editar `public/ads.txt` e substituir por:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

(Trocar `pub-XXXXXXXXXXXXXXXX` pelo seu ID real. Notar: **sem** o prefixo `ca-` aqui.)

Commit e push.

### 5. Verificar

Após 24-48h da aprovação + config:

1. Abrir https://fakeforge.com.br/gerador-cpf em janela anônima
2. Scroll até final. Deve ver bloco "Publicidade" com ad Google
3. Console DevTools não deve ter erros AdSense
4. AdSense dashboard deve mostrar "Impressions" subindo

## Revenue esperado (realista)

Baseado em 5k visitantes/mês + CPM médio pra BR de R$1-3:
- 5.000 pageviews × 2 impressions/page × R$2 CPM / 1000 = **~R$20/mês inicial**
- Escala linear com SEO. Meta 20k visitantes/mês = R$80-150/mês.

Não é o pote de ouro, mas cobre parte do Vercel ($30/mês ≈ R$160).

## Placement adicionais (se CTR for OK após 2 semanas)

Adicionar `<AdBanner label="Publicidade" className="max-w-3xl mx-auto" />` em:
- `/gerador-pessoa`
- `/gerador-pix`
- `/blog/*` (posts longos)
- `/comparacao/*`
- `/melhor-gerador-cpf-testes-software`

Regra: **nunca** em `/dashboard`, `/admin/*`, `/pricing`, `/docs`, `/login`, `/signup` (áreas onde a gente quer conversão, não distração).

## Rollback rápido

Se AdSense degradar UX ou hurta conversão:

1. Remover as env vars `NEXT_PUBLIC_ADSENSE_*` no Vercel
2. Redeploy
3. Script não carrega, componentes retornam `null`
4. Zero ads em ~30s

Sem código pra reverter — tudo gated por env var.

## Compliance LGPD

Component tá configurado com `data-npa="1"` (non-personalized ads).
Isso significa:
- Google não usa cookie pra targeting personalizado
- **Não requer cookie consent banner**
- Revenue ~30-50% menor que ads personalizados
- Trade-off consciente: proteção legal > revenue max

Se quiser subir revenue depois, precisa implementar cookie banner + trocar `data-npa` pra `0`.
