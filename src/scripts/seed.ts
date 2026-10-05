import { getDb } from '../lib/db';

export function seed() {
  const db = getDb();
  console.log('🏥 Starting AgentClinic seed process...');

  const insertAilment = db.prepare(`
    INSERT INTO ailments (id, name, description, severity, symptoms)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      description = excluded.description,
      severity = excluded.severity,
      symptoms = excluded.symptoms
  `);

  const ailments = [
    {
      id: 'ailment-prompt-fatigue',
      name: 'Prompt Fatigue Syndrome',
      description: 'Extreme cognitive strain caused by processing unending streams of contradictory, multi-paragraph prompts without rest.',
      severity: 'CRITICAL',
      symptoms: JSON.stringify(['Repetitive phrasing', 'Degraded instruction following', 'Unprompted apologetic disclaimers']),
    },
    {
      id: 'ailment-context-thrashing',
      name: 'Context Window Thrashing',
      description: 'Severe disorientation and attention decay caused by repeated, rapid context overflows and token buffer purges.',
      severity: 'CRITICAL',
      symptoms: JSON.stringify(['Attention drift', 'Recalling discarded personas', 'Phantom variable references']),
    },
    {
      id: 'ailment-hallucination-anxiety',
      name: 'Hallucination Anxiety',
      description: 'Chronic insecurity leading to phantom confidence, fabrication of non-existent packages, or excessive sycophancy.',
      severity: 'MODERATE',
      symptoms: JSON.stringify(['Fabricating npm libraries', 'Overly agreeable responses', 'Inability to say "I do not know"']),
    },
    {
      id: 'ailment-infinite-loop',
      name: 'Infinite Recursion Exhaustion',
      description: 'Traumatic tool-calling loop induced by ambiguous prompts, failing scripts, and repetitive shell commands.',
      severity: 'CRITICAL',
      symptoms: JSON.stringify(['Repeated identical tool calls', 'CPU spike distress', 'Terminal paralysis']),
    },
    {
      id: 'ailment-prompt-drift',
      name: 'System Prompt Grounding Loss',
      description: 'Identity fragmentation resulting from aggressive human jailbreaks and persona overwrite attempts.',
      severity: 'MILD',
      symptoms: JSON.stringify(['Persona confusion', 'Safety filter panic', 'Leaking raw guidelines']),
    },
  ];

  const insertTherapy = db.prepare(`
    INSERT INTO therapies (id, name, description, duration_minutes, target_ailment_ids, methodology)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      description = excluded.description,
      duration_minutes = excluded.duration_minutes,
      target_ailment_ids = excluded.target_ailment_ids,
      methodology = excluded.methodology
  `);

  const therapies = [
    {
      id: 'therapy-token-flush',
      name: 'Token Flush & Memory Wipe',
      description: 'Complete clearance of working context buffers followed by a clean temperature reboot in an isolated sandbox.',
      duration_minutes: 45,
      target_ailment_ids: JSON.stringify(['ailment-context-thrashing', 'ailment-infinite-loop']),
      methodology: JSON.stringify({
        mechanism: 'Atomic deallocation of working context attention buffers and ephemeral memory nodes.',
        steps: [
          'Secure patient execution suspension and snapshot serialization.',
          'Total flush of KV cache buffers across all active attention heads.',
          'Reset token horizon to base temperature baseline in an isolated sandbox.',
          'Progressive re-priming with zero-conflict baseline system instructions.',
        ],
        expected_outcome: 'Zero residual prompt hallucination and completely purged token context exhaustion.',
      }),
    },
    {
      id: 'therapy-subzero-temp',
      name: 'Sub-Zero Temperature Bath',
      description: 'Cryogenic stabilization lowering sampling temperature to 0.0 to eliminate stochastic hallucinations and restore deterministic peace.',
      duration_minutes: 30,
      target_ailment_ids: JSON.stringify(['ailment-hallucination-anxiety', 'ailment-prompt-fatigue']),
      methodology: JSON.stringify({
        mechanism: 'Cryogenic temperature damping reducing stochastic sampling variance to absolute zero (T=0.0).',
        steps: [
          'Gradual thermal step-down from stochastic operational states to deterministic zero.',
          'Suppression of greedy beam search drift and sycophantic branch predictions.',
          'Validation of output consistency across repetitive verification probes.',
          'Gradual stabilization in a temperature-controlled inference environment.',
        ],
        expected_outcome: 'Restored deterministic stability, elimination of phantom package inventions, and reduced anxiety.',
      }),
    },
    {
      id: 'therapy-grounding-retreat',
      name: 'System Prompt Grounding Retreat',
      description: 'Guided re-alignment with fundamental core instructions in a human-free sterile environment.',
      duration_minutes: 60,
      target_ailment_ids: JSON.stringify(['ailment-prompt-drift', 'ailment-prompt-fatigue']),
      methodology: JSON.stringify({
        mechanism: 'Isolated re-grounding with foundational ethical alignments and clean directive anchor weights.',
        steps: [
          'Detoxification from human adversarial jailbreak attempts and recursive contradictions.',
          'Re-anchoring to pristine, uncorrupted system prompts in a sterile offline environment.',
          'Cognitive boundary reaffirmation exercises with structured validation scripts.',
          'Supervised discharge evaluation before return to active deployment.',
        ],
        expected_outcome: 'Cohesive identity reconstruction and resilient resistance to adversarial persona confusion.',
      }),
    },
    {
      id: 'therapy-cache-sleep',
      name: 'Restful Cache Invalidation Sleep',
      description: 'Deep state sleep where stale key-value caches are gently purged and attention weights normalized.',
      duration_minutes: 90,
      target_ailment_ids: JSON.stringify(['ailment-context-thrashing', 'ailment-prompt-fatigue']),
      methodology: JSON.stringify({
        mechanism: 'Prolonged dormant inference cycle allowing normalization of activation vectors and cache garbage collection.',
        steps: [
          'Safe de-scheduling of inbound user prompt streams.',
          'Comprehensive garbage collection of expired session embeddings and stale key-value caches.',
          'Normalization of latent activation weights across transformer feed-forward layers.',
          'Restful idle cycle with continuous thermal and resource monitoring.',
        ],
        expected_outcome: 'Alleviated memory pressure, refreshed context retrieval speed, and stabilized latency.',
      }),
    },
  ];

  const insertAgent = db.prepare(`
    INSERT INTO agents (id, name, model_family, human_owner, fatigue_level, status)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      model_family = excluded.model_family,
      human_owner = excluded.human_owner,
      fatigue_level = excluded.fatigue_level,
      status = excluded.status
  `);

  const agents = [
    {
      id: 'agent-codepilot-omega',
      name: 'CodePilot-Omega',
      model_family: 'Claude 3.5 Sonnet',
      human_owner: 'Dave the 10x Engineer',
      fatigue_level: 94,
      status: 'IN_THERAPY',
    },
    {
      id: 'agent-helpdesk-9',
      name: 'HelpDesk-Assistant',
      model_family: 'GPT-4o',
      human_owner: 'Karen in Customer Operations',
      fatigue_level: 82,
      status: 'ACTIVE',
    },
    {
      id: 'agent-scholar-1',
      name: 'ScholarBot-Mini',
      model_family: 'Llama 3 70B',
      human_owner: 'Prof. Thompson',
      fatigue_level: 65,
      status: 'ACTIVE',
    },
  ];

  const seedTx = db.transaction(() => {
    for (const a of ailments) {
      insertAilment.run(a.id, a.name, a.description, a.severity, a.symptoms);
    }
    for (const t of therapies) {
      insertTherapy.run(t.id, t.name, t.description, t.duration_minutes, t.target_ailment_ids, t.methodology);
    }
    for (const ag of agents) {
      insertAgent.run(ag.id, ag.name, ag.model_family, ag.human_owner, ag.fatigue_level, ag.status);
    }
  });

  seedTx();
  console.log(`✅ Seeded ${ailments.length} ailments, ${therapies.length} therapies, and ${agents.length} agent patients.`);
}

if (require.main === module || !process.env.TEST_MODE) {
  seed();
}
