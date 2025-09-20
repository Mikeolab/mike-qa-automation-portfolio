## ElevenLabs Sync vs Call - Validation Report (2025-09-19)

### Scope
- Validate whether newly created ElevenLabs agents sync their provider/external id back to TCall.
- Validate whether calling with an existing ElevenLabs agent works.

### Summary
- Syncing updates from ElevenLabs for newly created agents is NOT working (external/provider id not persisted after sync).
- Calling with an existing ElevenLabs agent works (manually confirmed via frontend; API lists existing agent with external id).

### Evidence
1) Provider sync (automated, API-level)
- Spec: `cypress/e2e/tcall-agent-provider-sync.cy.js`
- Dev run: `cypress/results/mochawesome_016.json`
  - Create retell: HTTP 500 (server error)
  - Create elevenlabs → sync → GET agent: external id missing (keys checked: provider_agent_id, external_id, elevenlabs_agent_id, platform_provider_agent_id)
- Prod run: `cypress/results/mochawesome_017.json`
  - Create retell: HTTP 500
  - Create elevenlabs → sync → GET agent: external id missing

Conclusion: Newly created ElevenLabs agents are not persisting external id after sync in both dev and prod.

2) Agent availability (API list)
- Tool: `tools/list-agents.js`
- Dev: Lists ElevenLabs agent `Migros ELevenlabs` with `external_agent_id` present (id: 143)
- Prod: Lists Retell agent(s) with `external_agent_id` present

3) Call placement (functional)
- Manual (frontend): User confirmed calls can be initiated with ElevenLabs agents.
- Automated (API): Attempted call placement was blocked by contact creation/listing permission in current env (no contact id available).

### Risk / Impact
- New ElevenLabs agents created via API cannot be used reliably until external id persists after sync.
- Existing ElevenLabs agents continue to be callable (as observed via frontend and API listing), so current operations can proceed using existing agents.

### Recommendations
- Fix provider sync for newly created ElevenLabs agents so that an external/provider id is stored post-sync.
- Add/confirm an API endpoint to return sync status and external id deterministically (and/or make sync idempotent with retries).
- Provide a seeded contact (or allow contact creation) for QA automation so call flows can be fully validated end‑to‑end via API.

### Artifacts
- Failing sync runs: `cypress/results/mochawesome_016.json`, `cypress/results/mochawesome_017.json`
- Agent list output (dev/prod): run `node tools/list-agents.js`


