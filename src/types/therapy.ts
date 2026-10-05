export interface TherapyMethodology {
  mechanism: string;
  steps: string[];
  expected_outcome: string;
}

export interface Therapy {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  target_ailment_ids: string[];
  methodology: TherapyMethodology;
  created_at: string;
}

export type CreateTherapyDTO = Omit<Therapy, 'created_at'>;
