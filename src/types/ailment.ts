export type AilmentSeverity = 'MILD' | 'MODERATE' | 'CRITICAL';

export interface Ailment {
  id: string;
  name: string;
  description: string;
  severity: AilmentSeverity;
  symptoms: string[];
  created_at: string;
}

export type CreateAilmentDTO = Omit<Ailment, 'created_at'>;
