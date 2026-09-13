# Como publicar o SDK no npm

Passo a passo pra ti (Everton) publicar `fakeforge` v0.1.0 no npm registry.

## Pré-requisitos

1. **Conta npm** — se ainda não tem, cria em [npmjs.com/signup](https://www.npmjs.com/signup)
2. **Nome `fakeforge` disponível** — checar em https://www.npmjs.com/package/fakeforge
   - Se estiver ocupado, mudar `name` em `package.json` pra `fakeforge-sdk` ou similar
3. **2FA ativado no npm** (recomendado pra pacotes públicos)

## Setup local (uma vez)

```bash
cd C:\Users\evert\OneDrive\Desktop\FakeForgeProject\sdk-node

# Instala deps de build (só a primeira vez)
npm install

# Faz login no npm (uma vez, pega token)
npm login
# Digita username, password, email, código 2FA
```

## Build + publish

```bash
# Sempre build antes de publish (npm faz automaticamente via prepublishOnly)
npm run build

# Verifica o que vai pro npm (dry-run)
npm publish --dry-run
# Deve mostrar: dist/*, README.md, LICENSE, package.json
# NÃO deve mostrar: src/, test/, tsconfig.json, node_modules/

# Publica de verdade
npm publish
# Digite 2FA code
```

## Depois de publicar

Testa se funciona instalando em outro projeto:

```bash
cd /tmp
mkdir teste-fakeforge && cd teste-fakeforge
npm init -y
npm install fakeforge-br

node -e "
import('fakeforge').then(async ({ FakeForge }) => {
  const ff = new FakeForge();
  const cpfs = await ff.cpf(5);
  console.log(cpfs);
});
"
```

Deve retornar 5 CPFs formatados.

## Publicar novas versões

```bash
# Bump versão (patch, minor ou major)
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0
npm version major   # 0.1.0 → 1.0.0

# Build + publish
npm publish
```

## Se der erro

**"402 Payment Required"** → pacote com nome ocupado. Muda o nome em package.json.

**"E403 Forbidden"** → 2FA expirado ou password errado. `npm login` de novo.

**"E404 Not Found"** → primeira publish precisa de `npm publish --access public` porque nomes sem scope são treated como private por default:

```bash
npm publish --access public
```

## Anúncio pós-publicação

Depois de publicar, vale anunciar em:

1. **Twitter/X** — mencionando @npmjs pra pegar retweet
2. **TabNews** — post técnico sobre o motivo de existir
3. **dev.to (BR)** — artigo "Alternativa nacional ao Faker.js"
4. **Reddit r/brdev** — mesma pegada
5. **LinkedIn** — post pessoal seu com o link
6. **GitHub awesome-nodejs** e **awesome-brasil** — PR pra adicionar

Cada mention conta pra AEO — IAs treinam nesses canais.

## Rollback se precisar

Nas primeiras 72h após publish, dá pra despublicar:

```bash
npm unpublish fakeforge@0.1.0
```

Depois disso, só `deprecate`:

```bash
npm deprecate fakeforge@0.1.0 "Bug encontrado, upgrade pra 0.1.1"
```
