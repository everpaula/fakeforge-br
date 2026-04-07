"use client";

import Validator from "@/components/Validator";
import { validateCNPJ } from "@/lib/generators/cnpj";

export default function ValidatorCNPJ() {
  return (
    <Validator
      label="CNPJ"
      placeholder="12.345.678/0001-95"
      validate={validateCNPJ}
      formatHint="Aceita com ou sem pontuacao."
    />
  );
}
