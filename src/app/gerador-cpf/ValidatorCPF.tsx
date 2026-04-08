"use client";

import Validator from "@/components/Validator";
import { validateCPF } from "@/lib/generators/cpf";

export default function ValidatorCPF() {
  return (
    <Validator
      label="CPF"
      placeholder="123.456.789-09"
      validate={validateCPF}
      formatHint="Aceita com ou sem pontuação."
    />
  );
}
