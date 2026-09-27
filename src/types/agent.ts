export type AgentStatus = 'ACTIVE' | 'IN_THERAPY' | 'DISCHARGED';

export interface Agent {
  id: string;
  name: string;
  model_family: string;
  human_owner: string;
  fatigue_level: number; // 0 - 100
  status: AgentStatus;
  created_at: string;
}

export type CreateAgentDTO = Omit<Agent, 'created_at'>;
