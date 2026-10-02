export type InfoProductId = "micro-saas";

export interface QualifyingOption {
  value: string;
  label: string;
}

export interface InfoProduct {
  id: InfoProductId;
  // null = PDF da prévia ainda não existe: o email de boas-vindas avisa que ela chega depois
  teaserUrl: string | null;
  emailSubject: string;
  emailPitch: string;
  emailQuestion: string;
  situationLabel: string;
  situations: QualifyingOption[];
}

export const BUDGETS: QualifyingOption[] = [
  { value: "ate-97", label: "Até R$ 97" },
  { value: "97-297", label: "De R$ 97 a R$ 297" },
  { value: "297-997", label: "De R$ 297 a R$ 997" },
  { value: "997+", label: "Acima de R$ 997, se tiver acompanhamento" },
  { value: "nao-sei", label: "Ainda não sei" },
];

export const INFO_PRODUCTS: Record<InfoProductId, InfoProduct> = {
  "micro-saas": {
    id: "micro-saas",
    teaserUrl: "/downloads/previa-playbook-micro-saas.pdf",
    emailSubject: "Você está na lista do playbook de micro SaaS",
    emailPitch:
      "o que funcionou e o que deu errado pra colocar o FakeForge no ar sozinho e sem investidor",
    emailQuestion:
      "onde você travou da última vez que tentou tirar um projeto do papel? Ideia, código, tráfego, cobrança.",
    situationLabel: "Em que ponto você está?",
    situations: [
      { value: "sem-ideia", label: "Quero criar um, mas ainda não tenho ideia validada" },
      { value: "construindo", label: "Estou construindo e ainda não lancei" },
      { value: "lancado-sem-trafego", label: "Lancei e quase ninguém aparece" },
      { value: "trafego-sem-receita", label: "Tenho usuário, mas quase ninguém paga" },
    ],
  },
};

export function isInfoProductId(value: unknown): value is InfoProductId {
  return typeof value === "string" && value in INFO_PRODUCTS;
}
