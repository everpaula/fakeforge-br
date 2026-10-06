# PR templates pros 5 awesome lists

Pré-requisito: **repositório `everpaula/fakeforge-br` precisa estar PÚBLICO**. Hoje está privado. Antes de abrir qualquer PR:

```
gh repo edit everpaula/fakeforge-br --visibility public
```

Confirme com `gh repo view everpaula/fakeforge-br --json visibility` que o retorno é `PUBLIC`.

Depois disso, vai nos 5 PRs abaixo. Cada um tem fork + edit + commit + push + PR open. Tempo total: ~1-2h.

---

## 1. awesome-made-by-brazilians

Repo: https://github.com/felipefialho/awesome-made-by-brazilians

**Fork + clone:**
```bash
gh repo fork felipefialho/awesome-made-by-brazilians --clone
cd awesome-made-by-brazilians
```

**Edit:** procura seção "Softwares & Tools". Em ordem alfabética, adiciona:

```markdown
- [FakeForge](https://github.com/everpaula/fakeforge-br) - REST API and SDKs (Node, Python) to generate valid Brazilian synthetic data (CPF, CNPJ, CEP, PIX, credit cards) for software testing. Free tier of 50 calls/day.
```

**Commit + PR:**
```bash
git checkout -b add-fakeforge
git add README.md
git commit -m "feat: add FakeForge"
git push origin add-fakeforge
gh pr create --title "Add FakeForge (Brazilian synthetic data API + SDKs)" --body "Hey! Just published [fakeforge-br](https://www.npmjs.com/package/fakeforge-br) on npm and [fakeforge-br](https://pypi.org/project/fakeforge-br/) on PyPI. REST API and SDKs to generate valid Brazilian test data (CPF/CNPJ mod-11, PIX BACEN, credit cards with Luhn, correlated customers). Open source and used by Brazilian devs for CI/CD seeds. Thanks for maintaining this list!"
```

---

## 2. made-in-brazil

Repo: https://github.com/ionicabizau/made-in-brazil

**Fork + clone:**
```bash
gh repo fork ionicabizau/made-in-brazil --clone
cd made-in-brazil
```

**Edit:** README.md tem seções por categoria. Adiciona em "Testing" (ou cria se não houver):

```markdown
### Testing

- [FakeForge](https://fakeforge.com.br) - Generate valid Brazilian test data via REST API: CPF, CNPJ, CEP, PIX, bank accounts with Luhn/mod-11 validation. Free tier available. ([GitHub](https://github.com/everpaula/fakeforge-br))
```

**Commit + PR:**
```bash
git checkout -b add-fakeforge
git add README.md
git commit -m "Add FakeForge to Testing section"
git push origin add-fakeforge
gh pr create --title "Add FakeForge (Brazilian test data REST API)" --body "Added FakeForge under Testing. It's a Brazilian-made REST API + SDKs (Node, Python, cURL) that generates valid Brazilian synthetic data for software testing. Zero dependencies on the SDK side. Thanks for maintaining this!"
```

---

## 3. opensource-br

Repo: https://github.com/backend-br/opensource-br

**Fork + clone:**
```bash
gh repo fork backend-br/opensource-br --clone
cd opensource-br
```

**Edit:** adiciona em `README.md` seguindo o padrão da lista (geralmente tabela):

```markdown
| [FakeForge](https://github.com/everpaula/fakeforge-br) | SaaS/API | TypeScript/Python | API REST + SDKs pra gerar dados brasileiros válidos pra testes de software |
```

**Commit + PR:**
```bash
git checkout -b add-fakeforge
git add README.md
git commit -m "feat: add FakeForge to opensource-br"
git push origin add-fakeforge
gh pr create --title "Add FakeForge" --body "FakeForge é uma API REST brasileira pra gerar dados sintéticos pra testes (CPF, CNPJ, CEP, PIX, cartão com validação real). SDKs oficiais em Node e Python publicados no npm e PyPI. Código open source. Valeu!"
```

---

## 4. awesome-nodejs (via SDK Node)

Repo: https://github.com/sindresorhus/awesome-nodejs

**Importante:** essa lista tem 350K+ stars e padrão rigoroso. Lê o [CONTRIBUTING.md](https://github.com/sindresorhus/awesome-nodejs/blob/main/contributing.md) primeiro.

Requisitos:
- Package tem que estar no npm (✓ `fakeforge-br` está)
- Pelo menos 30 dias de maturidade (verifica em 30 dias se já passou)
- README do SDK precisa estar completo (✓ já expandido)
- Descrição curta, começa com nome em bold

**Fork + clone:**
```bash
gh repo fork sindresorhus/awesome-nodejs --clone
cd awesome-nodejs
```

**Edit:** procura seção "Testing" (ordem alfabética):

```markdown
- [fakeforge-br](https://github.com/everpaula/fakeforge-br) - Brazilian test data generator with correlated fields (CPF, CNPJ, PIX, credit cards). REST API + SDK.
```

**Commit + PR:**
```bash
git checkout -b add-fakeforge-br
git add readme.md
git commit -m "Add fakeforge-br"
git push origin add-fakeforge-br
gh pr create --title "Add fakeforge-br" --body "Package: https://www.npmjs.com/package/fakeforge-br — SDK for Brazilian synthetic data generation. Zero dependencies, TypeScript native, CJS+ESM. Covers CPF/CNPJ mod-11, PIX BACEN, credit cards with Luhn, correlated customers. Tested in Node 18+."
```

**Nota:** aceitação demora 2-4 semanas. Rejeição comum se faltar: README em inglês, package com download history, exemplo rodando.

---

## 5. awesome-python (via SDK Python)

Repo: https://github.com/vinta/awesome-python

Mesmo padrão rigoroso.

Requisitos:
- Package no PyPI (✓ `fakeforge-br` está)
- README completo em inglês (**AÇÃO:** traduzir seções principais do README atual)
- Projeto ativo, última versão recente (✓)

**Fork + clone:**
```bash
gh repo fork vinta/awesome-python --clone
cd awesome-python
```

**Edit:** procura seção "Testing" > "Testing Frameworks" OU "Fake Data" (ordem alfabética):

```markdown
* [fakeforge-br](https://github.com/everpaula/fakeforge-br) - Brazilian synthetic data generator for testing (CPF, CNPJ, PIX, credit cards with correlation).
```

**Commit + PR:**
```bash
git checkout -b add-fakeforge-br
git add README.md
git commit -m "Add fakeforge-br to Testing"
git push origin add-fakeforge-br
gh pr create --title "Add fakeforge-br" --body "Package: https://pypi.org/project/fakeforge-br/ — Python SDK (3.8+) for generating valid Brazilian test data. Zero runtime deps (urllib stdlib), type-hinted with mypy strict compliance. Covers presets for correlated test data (customer, fintech, ecommerce_order)."
```

---

## Checklist antes de abrir todos os 5

- [ ] Repo `everpaula/fakeforge-br` está PÚBLICO
- [ ] README principal do repo é claro em inglês (ou tem versão)
- [ ] LICENSE existe na raiz
- [ ] Última versão SDK Node e Python publicada é > 7 dias (maturidade mínima)
- [ ] Package.json / pyproject.toml têm description, keywords e homepage corretos
- [ ] Nenhum arquivo sensível (.env, keys) commitado

## Follow-up pós-PR

- **Dia 0-14:** aguardar review. Mantenedor pode pedir ajuste.
- **Dia 7:** se nenhum feedback em awesome-nodejs/awesome-python, comentar polidamente no PR puxando atenção.
- **Dia 30:** se não aceito, ajustar baseado no feedback e tentar lista alternativa (ex: `awesome-testing`, `awesome-node-utils`).

## Métricas de sucesso (6 meses)

| Métrica | Baseline | Target 6m |
|---|---|---|
| GitHub stars no repo | 0 | 50-200 |
| npm weekly downloads | 0 | 500-2.000 |
| PyPI monthly downloads | 0 | 1.000-5.000 |
| Ref domains vindos de awesome lists | 0 | 5-15 |
| Awesome lists aceitas | 0 | 3-5 |

Se bater nos targets, FakeForge entra no radar da comunidade dev BR e cresce organicamente sem pagar ads.
