// Configuração compartilhada do pipeline de blog automation.

export const BANNED_WORDS = [
  // PT-BR fluff típico de IA
  "mergulhar", "desbloquear", "potencializar", "potencializa",
  "no mundo de hoje", "no cenário atual", "no contexto atual",
  "vamos descobrir", "vamos explorar", "jornada", "ecossistema",
  "transformar a forma", "soluções inovadoras", "alavancar",
  "em um mundo cada vez mais", "vale ressaltar", "por outro lado",
  "robusto e", "soluções robustas", "experiência única",
  "no panorama atual", "não é apenas",
];

export const CATEGORIES = ["Tutoriais", "LGPD", "Conceitos", "Comparativos", "News"] as const;
export type Category = typeof CATEGORIES[number];

export const QUALITY_THRESHOLDS = {
  minWords: 1200,
  maxWords: 2800,
  minH2Count: 5,
  minCodeBlocks: 1, // tutoriais e conceitos exigem código; comparativos podem não ter
  minFaqCount: 4,
};

export const FAKEFORGE_CONTEXT = `
FakeForge BR (https://fakeforge.com.br) é um gerador de dados brasileiros fictícios para devs:
- 16 geradores: CPF, CNPJ, CNPJ Alfanumérico (vigência 01/07/2026), CIN, RG, CNH, PIS/PASEP, Título de Eleitor, CEP, telefone, email, PIX, cartão de crédito (Visa/Master/Elo/Hipercard/Amex), pessoa, empresa, endereço, conta bancária
- 2 validadores: CPF e CNPJ
- API REST: /api/generate?type=X&quantity=N&format=json|csv|sql
- Modelo freemium: web grátis ilimitado, API com 100 chamadas/dia grátis ou planos pagos (Dev R$29, Team R$79)
- Stack: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- Diferencial vs concorrentes: API REST, dados correlacionados, export SQL com CREATE TABLE pronto
- LGPD-safe: nenhum dado real é usado ou armazenado

Sites internos para linkar quando relevante:
/gerador-cpf, /gerador-cnpj, /gerador-cnpj-alfanumerico, /gerador-pessoa,
/gerador-pix, /gerador-cartao (e /visa, /mastercard, /elo, /hipercard, /amex),
/gerador-rg, /gerador-cin, /gerador-cnh, /gerador-pis, /gerador-titulo-eleitor,
/validar-cpf, /validar-cnpj, /docs, /pricing, /blog, /comparacao/fakeforge-vs-alternativas
`.trim();

export const TONE_RULES = `
TOM (não-negociável):
- Português brasileiro com acentos corretos.
- Direto. Engenheiro pra engenheiro.
- Frases curtas. Voz ativa.
- PROIBIDO: ${BANNED_WORDS.join(", ")}.
- PROIBIDO: emojis, pontos de exclamação em parágrafo.
- Cada H2 começa com afirmação prática, NÃO com pergunta retórica.
- Quando citar lei, citar artigo (ex: "LGPD Art. 7º, IX") e linkar https://www.planalto.gov.br/...
- Quando usar número, dar fonte (ex: "Receita Federal 2024").
- Exemplos sempre brasileiros (CPF, CNPJ, PIX, BACEN, LGPD).
- Código rodável sempre (TypeScript ou JavaScript preferencial).
`.trim();
