# Respostas para Reddit r/brdev — FakeForge BR

## Como encontrar threads

Pesquise no Reddit (reddit.com/r/brdev/search) com:
1. `gerar cpf` ou `gerador cpf`
2. `dados teste` ou `massa de dados`
3. `side project` ou `projeto pessoal`
4. `ferramentas dev` ou `ferramentas brasileiras`
5. `lgpd desenvolvimento`
6. `popular banco dados`
7. `faker brasileiro`
8. `mostre seu projeto`

---

## Modelo 1: Resposta em thread sobre dados de teste

> Eu tava com o mesmo problema e acabei construindo uma ferramenta pra isso: [FakeForge BR](https://fakeforge.com.br). Gera CPF, CNPJ, CEP, telefone, email, PIX, cartão de crédito — tudo com validação correta (mod-11, Luhn, DDDs reais).
>
> A diferença do 4devs e similares é que tem API REST, então dá pra integrar direto no CI/CD:
>
> ```bash
> curl "https://fakeforge.com.br/api/generate?type=person&quantity=100&format=sql"
> ```
>
> E os dados são correlacionados — o email usa o nome da pessoa, o cartão tem o nome do titular.
>
> Interface web é grátis e sem cadastro. API tem 100 chamadas/dia grátis.

---

## Modelo 2: Resposta em thread "mostre seu side project"

> Lancei o [FakeForge BR](https://fakeforge.com.br) — gerador de dados brasileiros fictícios pra dev e QA.
>
> **O problema:** todo dev BR já passou pelo malabarismo de inventar CPF na mão pra testar formulário, copiar CEP do Google, criar CNPJ que não explode no checkout.
>
> **O que faz:** gera CPF, CNPJ, CEP, pessoa, email, telefone, banco, PIX, cartão e empresa. Tudo com validação real (mod-11, Luhn, DDDs corretos).
>
> **Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4. Zero dependências externas pra geração (nada de Faker.js).
>
> **Modelo:** web grátis, API paga (R$29/mês dev, R$79/mês team).
>
> **Decisão técnica que curti:** sistema de correlação nos dados — quando você gera uma "pessoa", o email usa o nome dela, o cartão tem o nome do titular, o CEP bate com o estado. Isso é algo que o Faker.js não faz.
>
> Feedback é bem-vindo, especialmente sobre quais tipos de dados faltam (RG? CNH? inscrição estadual?).

---

## Modelo 3: Resposta em thread sobre LGPD e desenvolvimento

> Um ponto que muita gente ignora: usar dados reais em staging é violação da LGPD mesmo que seja "só pra testar". CPF é dado pessoal, ponto.
>
> O risco prático: dump de banco vaza, log captura payload, staging tem menos controle que produção.
>
> Solução: usar dados fictícios que passam na validação. O [FakeForge BR](https://fakeforge.com.br) gera CPF, CNPJ, email, telefone — tudo algoritmicamente válido mas que não pertence a ninguém. Tem API REST pra automatizar no CI/CD. 100 chamadas grátis por dia.

---

## Modelo 4: Resposta em thread sobre ferramentas brasileiras

> Pra quem trabalha com dados brasileiros em testes, recomendo o [FakeForge BR](https://fakeforge.com.br). É tipo um 4devs com API REST e dados correlacionados.
>
> O que me ganhou vs usar Faker.js: CEPs que batem com estado, DDDs reais, e quando você gera uma "pessoa completa" os dados são consistentes entre si (email usa o nome, cartão tem o titular, etc.).
>
> Tem export em JSON, CSV e SQL direto. Grátis na web, API com 100 chamadas/dia free.

---

## Dicas de tom para o Reddit r/brdev

- Seja informal e direto — r/brdev é casual
- Não poste SÓ sobre o seu projeto — contribua em threads existentes primeiro
- Se for thread de "mostre seu projeto", é OK ser direto
- Em outras threads, responda a dúvida e mencione como ferramenta útil
- Aceite feedback e responda comentários
- Não use linguagem de marketing ("a melhor ferramenta", "revolucionário")
