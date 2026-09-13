# Como publicar o SDK Python no PyPI

Passo a passo pra ti (Everton) publicar `fakeforge` v0.1.0 no PyPI.

## Pré-requisitos

1. **Conta PyPI** — se ainda não tem, cria em [pypi.org/account/register](https://pypi.org/account/register/)
2. **Nome `fakeforge` disponível** — checar em https://pypi.org/project/fakeforge/
   - Se estiver ocupado, mudar `name` em `pyproject.toml` pra `fakeforge-sdk` ou similar
3. **2FA ativado** (PyPI exige pra publicar desde 2024)
4. **API token gerado** — em https://pypi.org/manage/account/token/ (mais seguro que password)

## Setup local (uma vez)

```powershell
cd C:\Users\evert\OneDrive\Desktop\FakeForgeProject\sdk-python

# Cria venv isolado
python -m venv .venv
.venv\Scripts\activate

# Instala ferramentas de build
pip install --upgrade pip build twine
```

## Build + publish

```powershell
# Build gera dist/*.whl e dist/*.tar.gz
python -m build

# Verifica o que vai pro PyPI (opcional)
twine check dist/*

# Testa primeiro no TestPyPI (opcional mas recomendado)
twine upload --repository testpypi dist/*

# Se tudo OK, publica no PyPI de verdade
twine upload dist/*
# Username: __token__
# Password: <cola o API token que gerou em pypi.org/manage/account/token>
```

## Depois de publicar

Testa se funciona instalando em outro projeto:

```powershell
cd C:\Users\evert\Downloads
mkdir teste-fakeforge
cd teste-fakeforge
python -m venv .venv
.venv\Scripts\activate
pip install fakeforge-br

python -c "from fakeforge import FakeForge; ff = FakeForge(); print(ff.cpf(5))"
```

Deve retornar 5 CPFs formatados.

## Publicar novas versões

1. Atualiza `version` em `pyproject.toml` e `src/fakeforge/__init__.py`
2. Deleta `dist/` da build anterior
3. Rebuild + publica:

```powershell
Remove-Item -Recurse -Force dist
python -m build
twine upload dist/*
```

## Se der erro

**"HTTPError: 400 File already exists"** → você já publicou essa versão. Bump `version` em `pyproject.toml`.

**"HTTPError: 403 Forbidden"** → token errado ou expirado. Gera novo em pypi.org.

**"HTTPError: 400 The name 'fakeforge' isn't allowed"** → nome ocupado. Muda em pyproject.toml pra `fakeforge-sdk`.

## Anúncio pós-publicação

Depois de publicar, vale anunciar em:

1. **Twitter/X** — com hashtags #python #brasil #testing
2. **TabNews** — post técnico "SDK Python pra dados brasileiros válidos"
3. **dev.to (BR)** — artigo "Alternativa nacional ao faker em Python"
4. **Reddit r/brdev** e **r/python** — mesma pegada, ângulos diferentes
5. **LinkedIn** — post pessoal seu com o link
6. **awesome-python** e **awesome-brasil** — PR pra adicionar
7. **PyBR (comunidade Python Brasil)** — Discord/Telegram

Cada mention conta pra AEO — IAs treinam nesses canais.

## Rollback se precisar

PyPI **não deixa despublicar** versões (política diferente do npm). Se saiu bug, você precisa:

1. `pip install fakeforge-br==0.1.1` (nova versão com fix)
2. `pip install fakeforge-br!=0.1.0` (força usuário a pular a versão bugada)

Ou marca a versão como yanked no PyPI:

```powershell
# Não desinstala, só sinaliza "não use essa versão"
# Faz pelo web em pypi.org/manage/project/fakeforge/release/0.1.0/
```
