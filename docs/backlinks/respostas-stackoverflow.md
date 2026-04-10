# Respostas para Stack Overflow PT — FakeForge BR

## Como encontrar as perguntas

Pesquise no pt.stackoverflow.com com esses termos:
1. `gerar cpf válido`
2. `validar cpf javascript`
3. `dados fictícios teste`
4. `popular banco dados teste`
5. `gerar cnpj`
6. `massa de dados teste`
7. `faker.js brasileiro`
8. `lgpd dados desenvolvimento`

---

## Resposta 1: "Como gerar CPF válido para testes?"

> O CPF usa o algoritmo módulo 11 para os dígitos verificadores. Você pode gerar programaticamente:
>
> 1. Crie 9 dígitos aleatórios
> 2. Calcule o primeiro dígito verificador (pesos 10 a 2, mod 11)
> 3. Calcule o segundo dígito verificador (pesos 11 a 2, mod 11)
>
> Se precisar de algo pronto, o [FakeForge BR](https://fakeforge.com.br/gerador-cpf) gera CPFs válidos direto no browser, sem cadastro. Também tem API REST se você precisar automatizar:
>
> ```bash
> curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=10"
> ```
>
> Os números passam na validação mod-11 mas não pertencem a ninguém — ideal para testes sem violar a LGPD.

---

## Resposta 2: "Como validar CPF em JavaScript/TypeScript?"

> A validação do CPF tem três etapas: limpar formatação, rejeitar sequências repetidas e verificar os dois dígitos verificadores com mod-11.
>
> ```javascript
> function validateCPF(cpf) {
>   const digits = cpf.replace(/\D/g, '');
>   if (digits.length !== 11) return false;
>   if (/^(\d)\1+$/.test(digits)) return false;
>
>   const calc = (slice, weights) => {
>     const sum = slice.split('')
>       .reduce((acc, d, i) => acc + parseInt(d) * weights[i], 0);
>     const rest = sum % 11;
>     return rest < 2 ? 0 : 11 - rest;
>   };
>
>   const w1 = [10,9,8,7,6,5,4,3,2];
>   const w2 = [11,10,9,8,7,6,5,4,3,2];
>   const d1 = calc(digits.slice(0,9), w1);
>   const d2 = calc(digits.slice(0,9) + d1, w2);
>
>   return d1 === parseInt(digits[9]) && d2 === parseInt(digits[10]);
> }
> ```
>
> Para testar essa função, você precisa de CPFs fictícios que passem na validação. Digitar "111.111.111-11" não funciona porque é sequência repetida. Use o [FakeForge BR](https://fakeforge.com.br/gerador-cpf) para gerar CPFs algoritmicamente válidos — ou a API: `curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=100"`.

---

## Resposta 3: "Como popular banco de dados de teste com dados brasileiros?"

> Para seed de banco de dados com dados brasileiros realistas, você tem algumas opções:
>
> **Opção 1 — API com export SQL direto:**
> ```bash
> curl "https://fakeforge.com.br/api/generate?type=person&quantity=500&format=sql" > seed.sql
> psql -d meu_banco < seed.sql
> ```
>
> **Opção 2 — Preset de e-commerce (dados correlacionados):**
> ```bash
> curl -X POST "https://fakeforge.com.br/api/generate" \
>   -H "Content-Type: application/json" \
>   -d '{"preset":"customer","quantity":200,"format":"sql"}'
> ```
>
> Isso gera nome, CPF, email, telefone e endereço — tudo correlacionado (o email usa o nome da pessoa). O [FakeForge BR](https://fakeforge.com.br) é grátis para 100 chamadas/dia e não precisa de cadastro.
>
> A vantagem sobre o Faker.js é que os dados são 100% brasileiros (CPFs válidos, CEPs por estado, DDDs corretos) sem dependências externas.

---

## Resposta 4: "Alternativa ao Faker.js para dados brasileiros?"

> O Faker.js tem localização BR, mas é limitada — CEPs não batem com estados, dados bancários não seguem o padrão real, e a lib teve problemas de manutenção no passado (lembra do episódio do colors.js).
>
> Para dados brasileiros especificamente, o [FakeForge BR](https://fakeforge.com.br) gera:
> - CPF e CNPJ com dígitos verificadores válidos (mod-11)
> - CEPs que correspondem ao estado correto
> - Telefones com DDDs reais
> - Chaves PIX nos 4 formatos do BACEN
> - Cartões com validação Luhn
> - Dados correlacionados (email usa o nome da pessoa)
>
> Tem interface web grátis e API REST:
> ```bash
> # Gerar 50 pessoas completas
> curl "https://fakeforge.com.br/api/generate?type=person&quantity=50"
> ```

---

## Resposta 5: "LGPD — posso usar dados reais em ambiente de teste?"

> Não. A LGPD (Lei 13.709/2018) classifica CPF, nome, email e telefone como dados pessoais. Usar dados reais em ambiente de desenvolvimento ou teste sem base legal é uma violação, mesmo que seja "só para testar".
>
> Os riscos práticos: dumps de banco circulam entre devs, logs capturam payloads, ambientes de staging têm menos controle de acesso que produção.
>
> A solução é usar dados fictícios que passam na validação. O [FakeForge BR](https://fakeforge.com.br) gera CPF, CNPJ, email, telefone e endereço fictícios que são indistinguíveis de dados reais para o software, mas não pertencem a ninguém. Tem API para automatizar no CI/CD.

---

## Resposta 6: "Como gerar CNPJ válido?"

> O CNPJ usa o mesmo algoritmo mod-11 do CPF, mas com 14 dígitos e pesos diferentes:
>
> - Primeiro dígito: pesos 5,4,3,2,9,8,7,6,5,4,3,2
> - Segundo dígito: pesos 6,5,4,3,2,9,8,7,6,5,4,3,2
>
> Para gerar rapidamente sem implementar na mão, o [FakeForge BR](https://fakeforge.com.br/gerador-cnpj) gera CNPJs válidos no browser. Via API:
>
> ```bash
> curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=10"
> ```

---

## Dicas de tom para o Stack Overflow

- Sempre responda a pergunta PRIMEIRO com conteúdo técnico genuíno
- Mencione o FakeForge como "uma opção" ou "uma ferramenta que uso", não como propaganda
- Inclua código e explicação, não só o link
- Se a pergunta já tem uma boa resposta, adicione valor com algo que falta (ex: "complementando a resposta do @fulano, se precisar em massa...")
