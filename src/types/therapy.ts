export interface Therapy {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  target_ailment_ids: string[];
  created_at: string;
}

export type CreateTherapyDTO = Omit<Therapy, 'created_at'>;
