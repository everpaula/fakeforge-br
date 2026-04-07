const FIRST_NAMES_MALE = [
  "Miguel", "Arthur", "Heitor", "Bernardo", "Théo", "Davi", "Gabriel", "Samuel",
  "Lucas", "Pedro", "Rafael", "Matheus", "João", "Guilherme", "Felipe",
  "Gustavo", "Leonardo", "Bruno", "Daniel", "Eduardo", "Vinícius", "Rodrigo",
  "Thiago", "André", "Marcos", "Ricardo", "Fernando", "Diego", "Leandro",
  "Henrique", "Caio", "Igor", "Renato", "Marcelo", "Alexandre", "Carlos",
  "Paulo", "José", "Antônio", "Francisco",
];

const FIRST_NAMES_FEMALE = [
  "Helena", "Alice", "Laura", "Maria", "Valentina", "Sophia", "Isabella",
  "Manuela", "Júlia", "Heloísa", "Luísa", "Beatriz", "Cecília", "Lorena",
  "Lara", "Mariana", "Ana", "Camila", "Letícia", "Fernanda", "Gabriela",
  "Juliana", "Larissa", "Patrícia", "Raquel", "Carolina", "Bruna", "Amanda",
  "Renata", "Tatiana", "Daniela", "Vanessa", "Aline", "Bianca", "Débora",
  "Natália", "Priscila", "Viviane", "Sandra", "Cristiane",
];

const LAST_NAMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves",
  "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho",
  "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha",
  "Dias", "Nascimento", "Andrade", "Moreira", "Nunes", "Marques", "Machado",
  "Mendes", "Freitas", "Cardoso", "Ramos", "Gonçalves", "Santana", "Teixeira",
  "Araújo", "Correia", "Pinto", "Castro", "Melo", "Barros", "Campos",
  "Azevedo", "Monteiro", "Fonseca", "Reis", "Cunha", "Moura", "Duarte",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export type Gender = "male" | "female" | "random";

export interface Person {
  firstName: string;
  lastName: string;
  fullName: string;
  gender: "male" | "female";
}

export function generatePerson(gender: Gender = "random"): Person {
  const actualGender = gender === "random"
    ? (Math.random() < 0.5 ? "male" : "female")
    : gender;

  const firstName = pick(actualGender === "male" ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE);
  const lastName = `${pick(LAST_NAMES)} ${pick(LAST_NAMES)}`;

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    gender: actualGender,
  };
}

export function generateFullName(gender: Gender = "random"): string {
  return generatePerson(gender).fullName;
}

export function generateFirstName(gender: Gender = "random"): string {
  return generatePerson(gender).firstName;
}

export function generateLastName(): string {
  return `${pick(LAST_NAMES)} ${pick(LAST_NAMES)}`;
}
