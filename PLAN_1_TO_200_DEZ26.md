# Plano FakeForge 1 → 200 pagantes (Ago-Dez 2026)

*Gerado 2026-08-19 via workflow de 5 agentes (Growth Hacker + Product Manager + SEO Specialist + Ad Strategist + Sprint Prioritizer). Baseline: 1 pagante (Rogério), 227 users, 12.5k gerações/mês, R$29 MRR vs R$160 custo Vercel Pro.*

---

## Tese da campanha

O caminho do 1 → 200 não passa por ads pagos. Passa por três coisas: (1) apertar o funil Free → Paid que hoje tá em 0.44% e mata qualquer volume que vier, (2) reforçar o SEO que já tá em hockey stick, com páginas programáticas de intent transacional, e (3) shippar 2-3 features de lock-in (SDK, Team workspaces, presets verticais) que destravam o ticket R$79 e reduzem churn. Ago-Set = arrumar funil e plantar conteúdo. Out-Nov = colher SEO composto e ativar loops virais. Dez = push final com sponsorship + A/B de conversão.

## Progressão meta por mês

| Mês | Novos pagantes | MRR fim mês | Tráfego meta | Signups esperados | Ativação (first API call) |
|---|---|---|---|---|---|
| Ago (13 dias úteis) | 4 | R$145 | 4k clicks | 50 | 12 (25%) |
| Set | 20 | R$725 | 20k clicks | 200 | 60 (30%) |
| Out | 40 | R$1.885 | 60k clicks | 540 | 190 (35%) |
| Nov | 70 | R$3.915 | 130k clicks | 1.170 | 470 (40%) |
| Dez | 65 | R$5.800 | 220k clicks | 1.980 | 890 (45%) |

**Total: 199 pagantes, R$5.800 MRR estimado (mix ~85% Dev + 15% Team).**

Premissas: signup rate sobe de 0.5% pra ~1% até Nov (funil melhor), paid conversion sobe de 0.44% pra 3-4% (ativação forçada + quota wall contextual), ~15% dos pagantes vão pro Team R$79.

---

## Sprint Agosto (retomada 26/ago + última semana)

**Meta: 4 novos pagantes. Foco: consertar ativação antes de escalar topo.**

1. **Onboarding forçado com first API call (1 dia dev).** Modal ao criar conta que roda curl real via fetch com a key nova, marca `first_api_call_completed=true`. Hoje 227 signups viraram 13 keys criadas e 4 chamadas em 30d. Passar de 5.7% pra 25% de users ativados é a base do funil inteiro. KPI leading: % signups com 1+ call em 7 dias.

2. **Quota wall contextual + gráfico Free vs Dev no dashboard (2 dias).** Response 429 vira JSON com `your_usage_today`, `dev_plan_limit`, `upgrade_url`. Banner no dashboard pra quem bateu quota 2x na semana. Isso é pull, não CTA vazio. KPI: CTR upgrade banner + conversão coorte "bateu quota 2x".

3. **Ship Template A (Gerar X pra Y) — 60 páginas programáticas em 2 dias.** 12 tipos de dado × 5 stacks (Python/Django, Node/Nest, Ruby/Rails, PHP/Laravel, Java/Spring). Intent transacional altíssima, dev já tá com código aberto. Não replica template raso: cada página com snippet real diferente. KPI: páginas indexadas em 30 dias.

4. **5 calls de 20 min com heavy users Free (>500 items/mês) — 3h total.** Pergunta única: "o que faltaria pra pagar R$29?" Diagnostica gap real antes de shippar mais feature. KPI: 5 calls feitas, insights consolidados.

## Sprint Setembro

**Meta: 20 novos (total 25). Foco: SEO composto + primeiro loop viral + preset packs verticais.**

1. **Preset packs verticais: E-commerce BR, Fintech, Healthtech (3-4 dias).** Não é feature nova, é curadoria dos endpoints em bundles nomeados. Free tem 1 pack, Dev tem todos. Muda a percepção "gerador genérico" pra "bundle pronto". KPI: % signups que abrem preset em 7 dias.

2. **Watermark opcional no copy (Loop viral #1, 6h).** Toggle default ON no Free: JSON copiado tem `// gerado em fakeforge.com.br — 100 CPFs em 2s`. Dev cola em Slack/PR/Notion, time inteiro vê. Auto-removido no Dev/Team (justifica upgrade). KPI: % copies que geram visita nova em 30d, meta 5%+.

3. **Template B: 12 validadores gratuitos sem login (1 semana).** CPF, CNPJ, PIS, CNH, CEP, PIX, cartão, RG, título eleitor, CNS, IE, banco. Cada um é ferramenta funcional que rankeia sozinha e vira backlink magnet. Cross-link forte pro gerador. KPI: páginas rankeando top 10 em 60d.

4. **2 posts/semana no blog + 1 no TabNews quinzenal (ongoing).** Blog = clusters de dados sintéticos + stack-específico. TabNews = postmortem técnico honesto ("como gerei 110k CPFs válidos pra staging sem violar LGPD"), 90% aprendizado 10% link. KPI: 8 posts publicados, 1 TabNews com 300+ visitas.

5. **SDK Node oficial (2-3 dias) — primeiro, Python fica pra Out.** `npm install @fakeforge/sdk` publicado. Reduz churn (trocar de provider vira refactor, não find-replace) e vira canal SEO extra via readme. KPI: downloads npm/mês + % pagantes usando SDK.

## Sprint Outubro

**Meta: 40 novos (total 65). Foco: escalar conteúdo + Team workspaces + primeiro data study.**

1. **Team workspaces multi-user (3-4 dias).** 1 workspace, N members, keys por member, uso agregado por env tag. Destrava R$79 real (hoje Team é só quota maior, não justifica salto 2.7×). Trava churn (sair vira decisão de time). KPI: primeiros 2-3 Teams fechados.

2. **SDK Python + Template C (cheatsheets stack × caso de uso, 30 páginas).** SDK Python 2-3 dias + 30 cheatsheets 5 dias. Cheatsheet = snippet longo copiável + embed do gerador. KPI: 30 páginas indexadas, SDK Python com 50+ downloads/mês.

3. **Widget embed com backlink dofollow (2 dias).** Botão "adicionar validador CPF ao seu site" gera iframe com backlink. Multiplica backlinks sem outreach chato. KPI: 10 sites usando widget em 30d.

4. **Data study "Estado do dev BR" v1 (3 dias).** Agregado anônimo do próprio FakeForge: stacks mais usadas, tipos de dado, horários de pico. Distribui via TabNews, dev.to BR, LinkedIn do Everton, DM pra Filipe Deschamps + newsletters tech. Dado próprio = ninguém tem. KPI: 3+ referências em veículos/newsletters.

5. **Referral 3 seats = 3 meses grátis (12h).** Convida 3 devs que criam conta e usam 1x = ganha 3 meses Dev. Anti-gaming: só conta se convidado gerou 10+ items em sessões diferentes. KPI: % pagantes ativando 1+ convite, meta 15%.

## Sprint Novembro

**Meta: 70 novos (total 135). Foco: colher composto do SEO + fixture pública + primeiro sponsorship pago.**

1. **Fixture pública compartilhável (Loop viral #3, 2 dias).** URL tipo `fakeforge.com.br/f/abc123`, expira 7d, contador de views, cap 500KB, rate limit 20/dia por conta paga. Dev cola no PR, no Jira, no docs. Quem abre vê banner "gera o seu em 5s". KPI: % datasets Dev+ que viram share, visitas/share.

2. **Sponsorship newsletter dev BR — Filipe Deschamps OU Codecasts OU Rocketseat (R$200-300).** Um spot bem colocado com métrica dura (110k items gerados, 227 devs) + link direto formato JSON. Mede signup direto + assisted. Primeiro teste real de paid. KPI: CAC < R$100.

3. **50+ páginas programáticas adicionais + refino das que já rankeiam.** GSC identifica queries com impressões altas + CTR baixo, reescreve title/meta/H1. Composto: cada página de Set/Out amadurece agora. KPI: total 150+ URLs indexadas, 40% em top 20.

4. **Dashboard breakdown por endpoint + export CSV + env tag (1-2 dias).** Team lead precisa justificar R$79/mês internamente. Tag opcional `X-FakeForge-Env: staging|ci|dev` aparece no dashboard. KPI: retention Team em 30d, meta 90%+.

5. **Cold outreach targeted pra tech leads BR (4h/semana).** LinkedIn manual: 50 mensagens/semana hyper-específicas (menciona repo público, stack do job posting). Meta 2-4 signups/semana, 0.5-1 upgrade. KPI: taxa resposta > 5%, 1 Team/mês vindo daqui.

## Sprint Dezembro

**Meta: 65 novos (total 200). Sprint final, push all-out.**

1. **Data study v2 "Retrospectiva do dev BR 2026" (3 dias).** Repete formato de Out com dado do ano inteiro. Timing perfeito pra retrospectiva de fim de ano, pega ciclo editorial de dezembro. Distribui via mesma rede + LinkedIn boost orgânico. KPI: 5+ menções/backlinks.

2. **2 sponsorships adicionais + Google Ads Search teste R$300/mês.** Se sponsorship de Nov entregou CAC < R$100, escala pra 3 newsletters. Google Ads exact match only em long-tail: "gerar cpf teste", "mock brasileiro json", "cnpj fake api". Budget cap R$10/dia, kill se CAC > R$150 em 15 dias. KPI: CAC agregado paid < R$150.

3. **Push de conversão no dashboard: A/B em copy do upsell hero, teste anual com desconto (2 dias).** Anual Dev R$290 (2 meses grátis) = front-load caixa. Testa quota wall em 3 copies diferentes. KPI: paid conversion sobe pra 4%+.

4. **Product Hunt BR launch (1 dia prep + 1 dia execução).** Primeira semana de Dez. Não pra "viralizar", pra pegar 100-200 signups qualificados + backlink DR alto. Everton mobiliza rede LATAM (Ricardo, Lume network, ex-inDrive). KPI: top 5 do dia BR.

5. **Retenção heavy: email T+7d "seu resumo da semana" com métricas de uso do próprio user + upgrade CTA condicional.** Baseado no dashboard breakdown de Nov. Dev que gerou 8k items vê "você tá a 20% do limite Free". KPI: reativação de users dormentes > 30 dias.

---

## Realismo check

Factível, mas com pouca margem. 200 pagantes em 4.5 meses com 1 hoje exige composto de SEO + funil consertado + 2-3 features de lock-in shippando NO TEMPO. Everton solo trabalhando ~15h/semana em FakeForge dá conta se as prioridades não mudarem.

**3 apostas inegociáveis:**

1. **Ativação forçada em Ago semana 1.** Sem passar de 5.7% pra 25%+ de users com first call, qualquer tráfego novo é desperdiçado. Se não shippar até 31/ago, meta cai pra ~120 pagantes.
2. **SEO programático (Templates A+B+C = 100+ páginas) até fim de Out.** É o único canal que compound sem custo. Se atrasar 3 semanas, meta cai pra ~140.
3. **Team workspaces + SDK até fim de Out.** Sem ticket R$79 real, precisa de 200 Devs solo (impraticável dado churn). Se só tiver Dev, meta realista cai pra ~130 pagantes.

Se as 3 rodarem, 200 é batido. Se 1 falhar, alvo cai pra 130-150. Se 2 falharem, 80-100.

## Riscos que matam

1. **Funil Free → Paid não move de 0.44% mesmo com ativação + quota wall.** Sinal de que o produto é "nice to have" e não "must have" pra dev BR. Probabilidade média, impacto alto. Mitigação: 5 calls com heavy users em Ago descobre isso cedo. Se sinal ruim, pivota pricing (Dev R$19 anual, ou embed API paid per call).

2. **SEO stall ou penalização por thin content programático.** 100+ páginas com template semi-idêntico pode virar red flag pro Google. Probabilidade média, impacto alto. Mitigação: cada página com snippet real diferente + exemplo de output + validador embutido quando aplicável. Auditar Search Console semanal pra detectar cedo.

3. **Concorrente free lança versão BR (4Devs, Faker.js maintainer BR, gerador-app com API).** Baixa probabilidade, impacto alto. Mitigação: velocidade de shipping + SDK oficial + Team workspaces criam moat que copia leva 3-4 meses pra igualar.

4. **W-2 SafeRide acelera e come as 15h/sem de FakeForge.** Probabilidade média-alta (Everton em ramp-up SafeRide), impacto alto. Mitigação: cronograma de sprints já assumido conservador. Se cair pra 8h/sem, pausa Templates C + data study v2 e mantém só ativação + Templates A/B + SDKs.

5. **Watermark viral gera backlash público (dev BR reclama no Twitter).** Baixa probabilidade, impacto médio. Mitigação: watermark em 1 linha, formato idiomático, toggle visível no primeiro copy. Se pintar 1 reclamação séria, muda default pra OFF em 24h.

## Kill switches por mês

- **Fim Ago (31/ago):** meta 4. Se < 2 pagantes: pausa Templates A e volta pra fase de discovery. Roda mais 10 calls com free users, testa 3 novos copies de upsell. NÃO shippa mais feature sem sinal.
- **Fim Set (30/set):** meta 25 acumulado. Se < 13 (metade): pausa preset packs e SDK. Reforça ativação (funil visual, tour interativo, live chat no dashboard) + 10 calls extras. Assume que produto é o problema, não topo.
- **Fim Out (31/out):** meta 65 acumulado. Se < 32: pausa Team workspaces (obviamente ninguém quer R$79 ainda). Reforça Dev individual: preço anual, referral mais agressivo (6 meses grátis), retention emails. Se > 40: dobra sponsorship + adianta Product Hunt pra 1ª semana de Nov.
- **Fim Nov (30/nov):** meta 135 acumulado. Se < 68: aceita meta ajustada pra 150 e comunica no dashboard "estamos crescendo". Não queima reserva em Google Ads desesperado. Se > 100: aumenta budget de Google Ads pra R$600/mês em Dez e lança 2 sponsorships adicionais.
- **Fim Dez (31/dez):** meta 200. Se < 200 mas > 150: sprint estendido janeiro/2027 com foco em Team workspaces upsell dos Devs já fechados. Se < 100: revisão macro do modelo (pricing, ICP, canal principal).

## Métricas leading indicators (semanais)

1. **First API call rate em 7d.** Sinal #1 de ativação. Meta subir de 5.7% pra 15% em Set, 30% em Out, 40% em Nov. Se estagnar, funil tá quebrado antes de qualquer canal importar.
2. **Páginas indexadas + queries em top 20 GSC.** Composto SEO puro. Meta: +30 URLs indexadas/semana em Set-Out. Se cair pra <10/semana, algo travou em thin content ou crawl budget.
3. **Copy rate no gerador anônimo + % copies com watermark que viram visita nova.** Copy rate hoje 53% (bom). Watermark tracking mede se loop viral existe. Meta: 5%+ copies → visita em 30d após ship.
4. **Signups semanais + coorte 7d-to-key rate.** Signups mede topo, key rate mede intent. Se signups sobem mas key rate cai, tráfego tá virando mais broad e menos qualificado (ajusta targeting SEO).
5. **Quota-hit rate em Free + % desses users que clicam upsell.** Free que bate quota 2x/semana é o coorte com maior propensão a pagar. Meta: 8-12% de conversão desse coorte específico. Sinal antecipado do MRR de 30-45 dias à frente.

---

## Fontes (análises originais dos 4 agentes especialistas)

- **Growth Hacker** (aquisição + viral loops): 63s, 40.8k tokens
- **Product Manager** (features + retention): 62s, 40.9k tokens
- **SEO Specialist** (canal orgânico): 80s, 41.1k tokens
- **Ad Strategist** (paid vale?): 49s, 41k tokens
- **Sprint Prioritizer** (síntese): 120s, 53k tokens

Total workflow: 5 agentes, 217k tokens, 3m 21s.

Análises individuais disponíveis em `.claude/projects/.../subagents/workflows/wf_7e80c3ab-6c3/journal.jsonl` se quiser fundo em qualquer lente.
