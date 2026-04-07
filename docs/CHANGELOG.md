# Changelog

Todas as mudancas notaveis do projeto FakeForge BR serao documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [0.1.0] - 2026-04-07

### Sprint 1: Core Engine + API + UI

**Decisao de produto:**
O FakeForge BR foi escolhido como primeiro produto de um portfolio de micro-SaaS apos uma Full Agency Product Discovery com 8 agentes analisando 5 ideias. Foi selecionado por ter o MVP mais rapido (3-4 semanas), menor complexidade tecnica (2/5), e forte oportunidade de SEO no mercado brasileiro ("gerador de CPF" tem 100K-500K buscas/mes).

**O que foi construido:**

#### Generators (src/lib/generators/)
- CPF: geracao com checksum mod-11, funcao de validacao inclusa
- CNPJ: geracao com checksum mod-11, branch 0001, validacao inclusa
- CEP + Endereco: dados coerentes (cidade-estado-CEP-bairro) para 10 estados
- Pessoa: 40 nomes masculinos, 40 femininos, 50 sobrenomes brasileiros
- Email: dominos BR (gmail, hotmail, uol, bol, terra, ig), nome sem acentos
- Telefone: celular (prefixo 9) e fixo, DDDs validos por regiao
- Conta Bancaria: 17 bancos reais (Nubank, Inter, C6, Itau, BB, etc)
- Chave PIX: 4 tipos (CPF, email, telefone, aleatoria)
- Cartao de Credito: Visa, Mastercard, Elo com checksum Luhn
- Empresa: composicao de CNPJ + endereco + contato + nome procedural

#### API (src/app/api/generate/route.ts)
- GET /api/generate?type=cpf&quantity=10&formatted=true
- POST /api/generate com body JSON + formato de export
- Export em JSON, CSV (com headers achatados), SQL (com CREATE TABLE)
- Limite de 10.000 items por request

#### UI (src/app/page.tsx)
- Selecao por categoria (Documentos, Pessoa, Contato, Endereco, Financeiro, Empresa)
- Pills horizontais para tipo de dado
- Dropdown de quantidade + toggle formatado
- Grid para dados simples (CPF, CNPJ), accordion para dados complexos
- Copiar item individual com feedback visual
- Export buttons (.json, .csv, .sql)
- CTA de API aparece so apos primeira geracao (funil de conversao)
- Dark theme com design system teal + amber

#### Infra
- Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- Build passando sem erros
- Repositorio privado: github.com/everpaula/fakeforge-br

### Decisoes tecnicas tomadas
- **DOCX nao, web-first**: produto e web app, nao ferramenta desktop
- **Zero dependencias externas para geracao**: todos os geradores sao codigo proprio, sem Faker.js
- **Formatacao como toggle**: usuario escolhe entre "123.456.789-00" e "12345678900"
- **API sem auth no MVP**: reduz friccao, auth vem na Sprint 4
- **CTA condicional**: API snippet so aparece depois de gerar dados (nao confunde usuario casual)
