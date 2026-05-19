# Genesys Cloud MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes Genesys Cloud APIs as tools for AI assistants like Claude.

## Tools (~130 total)

### Core
| Category | Tools |
|---|---|
| **Users** | `get_me`, `get_user`, `search_users`, `list_users` |
| **Conversations** | `list_conversations`, `get_conversation`, `get_conversation_messages`, `get_conversation_recordings`, `get_user_conversations` |
| **Routing** | `list_queues`, `get_queue`, `list_queue_members`, `get_user_queues`, `list_skills`, `list_wrap_up_codes` |
| **Analytics** | `query_conversation_details`, `query_queue_observations`, `query_agent_observations`, `query_queue_aggregates`, `query_flow_observations` |
| **Presence** | `get_user_presence`, `set_user_presence`, `list_presence_definitions`, `get_users_presence_bulk` |
| **Groups** | `list_groups`, `get_group`, `list_group_members` |
| **Authorization** | `list_roles`, `get_user_roles`, `get_organization` |

### AI Portfolio
| Category | Tools |
|---|---|
| **Assistants & Copilot** | `list_assistants`, `get_assistant`, `get_assistant_copilot`, `get_conversation_suggestions`, `get_conversation_summary`, `get_conversation_participant_suggestion` |
| **Knowledge Base** | `list_knowledge_bases`, `get_knowledge_base`, `search_knowledge`, `list_knowledge_documents`, `get_knowledge_document`, `list_knowledge_categories`, `query_knowledge_feedback` |
| **Speech & Text Analytics** | `get_speech_text_analytics_settings`, `list_sta_programs`, `get_sta_program`, `list_sta_topics`, `get_sta_topic`, `query_sta_conversations`, `get_conversation_transcription`, `get_conversation_categories`, `list_sta_categories` |
| **Predictive Routing** | `list_predictors`, `get_predictor`, `get_queue_estimated_wait_time`, `get_agent_best_points` |
| **NLU / Language Understanding** | `list_nlu_domains`, `get_nlu_domain`, `list_nlu_domain_versions`, `detect_nlu_intent`, `list_nlu_intents` |
| **Bots** | `list_bot_connectors`, `list_bots`, `get_bot_summaries`, `list_genesys_bots` |
| **Agent Performance AI** | `list_performance_profiles`, `get_agent_scorecard` |

### Operations
| Category | Tools |
|---|---|
| **Workforce Management** | `list_business_units`, `get_business_unit`, `list_management_units`, `list_management_unit_agents`, `list_bu_schedules`, `get_bu_schedule`, `get_agent_schedule`, `list_bu_forecasts`, `get_bu_forecast`, `query_adherence`, `query_historical_adherence`, `list_time_off_requests`, `get_time_off_request`, `list_activity_codes`, `list_planning_groups`, `list_work_plans`, `list_shift_trades` |
| **Outbound** | `list_campaigns`, `get_campaign`, `get_campaign_stats`, `get_campaign_progress`, `list_contact_lists`, `get_contact_list`, `get_contact_list_contacts`, `get_contact_list_export`, `list_dnc_lists`, `get_dnc_list`, `list_campaign_sequences`, `list_callable_time_sets`, `list_attempt_limits`, `list_rule_sets`, `get_outbound_event_log` |
| **Quality Management** | `list_evaluation_forms`, `get_evaluation_form`, `query_evaluations`, `get_conversation_evaluations`, `get_evaluation`, `list_calibrations`, `get_calibration`, `list_survey_forms`, `query_surveys`, `get_conversation_surveys`, `get_agents_quality_scores`, `list_evaluation_aggregates` |
| **Architect Flows** | `list_flows`, `get_flow`, `list_flow_versions`, `get_flow_version`, `list_flow_outcomes`, `list_flow_milestones`, `list_data_tables`, `get_data_table`, `list_data_table_rows`, `get_data_table_row`, `list_prompts`, `get_prompt`, `list_system_prompts`, `list_routing_schedules`, `list_routing_schedule_groups`, `list_emergency_groups`, `list_ivr_configs` |
| **Recordings** | `get_recording`, `list_conversation_recordings`, `create_recording_bulk_job`, `get_recording_bulk_job`, `list_recording_retention_policies`, `get_recording_retention_policy`, `get_recording_settings`, `get_recording_encryption_configs`, `get_screen_recording_sessions`, `list_orphan_recordings` |

### Channels & Infrastructure
| Category | Tools |
|---|---|
| **Telephony** | `list_stations`, `get_station`, `list_edges`, `get_edge`, `get_edge_status`, `list_edge_lines`, `list_sites`, `get_site`, `list_site_outbound_routes`, `list_phones`, `list_phone_base_settings`, `list_trunks`, `get_trunk_metrics`, `list_did_pools`, `list_dids` |
| **Messaging** | `list_messaging_integrations`, `list_whatsapp_integrations`, `get_whatsapp_integration`, `list_sms_integrations`, `get_sms_integration`, `list_facebook_integrations`, `list_instagram_integrations`, `list_twitter_integrations`, `list_open_messaging_integrations`, `get_open_messaging_integration`, `list_supported_content_profiles`, `list_messaging_settings`, `list_email_domains`, `list_email_domain_routes` |

### Customer & Journey
| Category | Tools |
|---|---|
| **Customer Journey** | `list_journey_segments`, `get_journey_segment`, `list_action_maps`, `get_action_map`, `list_journey_outcomes`, `get_journey_outcome`, `get_customer_journey_sessions`, `get_journey_session`, `get_session_segments`, `list_action_templates` |
| **Web Deployments** | `list_web_deployments`, `get_web_deployment`, `list_web_deployment_configurations` |
| **External Contacts** | `list_external_contacts`, `search_external_contacts`, `get_external_contact`, `get_external_contact_notes`, `get_external_contact_conversations`, `list_external_organizations`, `search_external_organizations`, `get_external_organization`, `get_external_org_contacts`, `get_external_org_notes`, `list_external_contact_relationships` |

### People & Performance
| Category | Tools |
|---|---|
| **Gamification** | `list_gamification_profiles`, `get_gamification_profile`, `get_gamification_leaderboard`, `get_user_gamification_scores`, `get_user_gamification_insights`, `list_gamification_metrics` |
| **Learning** | `list_learning_modules`, `get_learning_module`, `list_learning_assignments`, `get_learning_assignment`, `get_learning_assignments_summary` |
| **Coaching** | `list_coaching_appointments`, `get_coaching_appointment`, `list_coaching_appointment_annotations`, `get_coaching_appointment_statuses`, `list_coaching_notifications`, `get_coaching_summary` |

### Platform
| Category | Tools |
|---|---|
| **Audit** | `list_audit_services`, `query_audit_log`, `get_audit_query_results`, `get_audit_query_status`, `realtime_audit_query` |
| **Integrations** | `list_integrations`, `get_integration`, `list_integration_types`, `get_integration_config`, `list_integration_actions`, `get_integration_action`, `get_integration_action_schema`, `execute_integration_action`, `list_integration_action_categories`, `list_integration_credentials` |
| **Notifications** | `list_notification_topics`, `create_notification_channel`, `list_notification_channels`, `get_channel_subscriptions`, `subscribe_to_topics`, `delete_channel_subscriptions` |
| **Locations** | `list_locations`, `get_location`, `search_locations` |

## Prerequisites

- Node.js 18+
- A Genesys Cloud organization with an OAuth 2.0 **Client Credentials** client

## Setup

### 1. Create an OAuth Client in Genesys Cloud

1. Navigate to **Admin > Integrations > OAuth**
2. Click **Add Client**
3. Set **Grant Type** to `Client Credentials`
4. Under **Roles**, assign the roles your client needs (at minimum, a read-only role for the APIs you intend to use)
5. Save and copy the **Client ID** and **Client Secret**

### 2. Install and Build

```bash
npm install
npm run build
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Configure Claude Desktop (or another MCP host)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "genesys-cloud": {
      "command": "node",
      "args": ["/absolute/path/to/genesys-cloud-mcp/dist/index.js"],
      "env": {
        "GENESYS_CLIENT_ID": "your-client-id",
        "GENESYS_CLIENT_SECRET": "your-client-secret",
        "GENESYS_REGION": "us-east-1"
      }
    }
  }
}
```

Alternatively, use `npx tsx` for development without a build step:

```json
{
  "mcpServers": {
    "genesys-cloud": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/genesys-cloud-mcp/src/index.ts"],
      "env": {
        "GENESYS_CLIENT_ID": "your-client-id",
        "GENESYS_CLIENT_SECRET": "your-client-secret",
        "GENESYS_REGION": "us-east-1"
      }
    }
  }
}
```

## Supported Regions

| Region | Base URL |
|---|---|
| `us-east-1` | api.mypurecloud.com |
| `us-west-2` | api.usw2.pure.cloud |
| `eu-west-1` | api.mypurecloud.ie |
| `eu-central-1` | api.mypurecloud.de |
| `eu-west-2` | api.euw2.pure.cloud |
| `ap-southeast-2` | api.mypurecloud.com.au |
| `ap-northeast-1` | api.mypurecloud.jp |
| `ap-south-1` | api.aps1.pure.cloud |
| `ca-central-1` | api.cac1.pure.cloud |
| `us-gov-west-1` | api.use2.us-gov-pure.cloud |

## Development

```bash
# Run in watch mode (no build needed)
npm run dev

# Type check
npm run typecheck
```

## Architecture

```
src/
├── index.ts          # MCP server entry point, env config, tool registration
├── auth.ts           # OAuth 2.0 client credentials + token cache
├── client.ts         # Axios-based API client with auto-retry on 401
├── types.ts          # Shared TypeScript types and region maps
└── tools/
    ├── users.ts       # User management tools
    ├── conversations.ts  # Conversation tools
    ├── routing.ts     # Queue and routing tools
    ├── analytics.ts   # Historical and real-time analytics
    ├── presence.ts    # Presence/availability tools
    └── groups.ts      # Groups and authorization tools
```

## How the Server Knows Which API to Call

This server does **not** expose all of Genesys Cloud's 500+ APIs. It exposes a curated set of **named tools**, each hard-wired to a specific API endpoint. When you ask Claude a question, Claude reads every tool's name and description, reasons about which tool matches your intent, and calls it with the right parameters.

For example:
- *"Who is currently waiting in the Support queue?"* → Claude calls `query_queue_observations` with your queue ID
- *"Show me all active voice calls"* → Claude calls `list_conversations` with `communicationType: "call"`
- *"What's Sarah's current status?"* → Claude calls `search_users` to find Sarah, then `get_user_presence` with her ID

If an API you need isn't listed in the Features table above, it isn't implemented yet — see **Adding New Tools** below.

## Adding New Tools

1. Find the endpoint in the [Genesys Cloud API Explorer](https://developer.genesys.cloud/devapps/api-explorer)
2. Create or extend a file in `src/tools/`
3. Export a `register*Tools(server, client)` function
4. Import and call it in `src/index.ts`

Each tool follows the pattern:

```typescript
server.tool(
  "tool_name",                          // unique snake_case name
  "Description shown to the AI",        // be specific — this is how Claude picks the right tool
  { param: z.string().describe("...") }, // typed, described parameters
  async ({ param }) => {
    const result = await client.get(`/some/endpoint/${param}`);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);
```

## Implementation Recommendations

### Prioritize for a Production-Ready Server

**Pagination helper**
Currently each tool returns a single page. For large datasets (users, queues, conversations), add a `fetchAllPages` utility in `client.ts` that iterates until `pageNumber * pageSize >= total`.

**Rate limiting**
Genesys Cloud enforces per-minute rate limits per OAuth client. Add a token-bucket or queue in `client.ts` to avoid 429 errors when tools are called in rapid succession. The `bottleneck` npm package is a lightweight option.

**Structured error responses**
Instead of throwing errors that crash the tool call, return them as readable MCP content so the AI can explain the problem to the user:
```typescript
catch (err) {
  return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
}
```

**Notifications / webhooks**
Real-time use cases (agent state changes, new interactions) require Genesys Cloud Notifications via WebSocket (`/api/v2/notifications/channels`). Implement a `NotificationClient` that subscribes to topics and can push updates as MCP resources or sampling requests.

**MCP Resources**
Beyond tools, MCP supports `resources` — named, URI-addressable data that Claude can read directly. Good candidates: the organization's queue list, presence definitions, and wrap-up codes (slow-changing reference data). Register them with `server.resource(...)` so Claude can consult them without a round-trip tool call.

### APIs Worth Adding Next

| API Group | Why it matters |
|---|---|
| **Workforce Management** | Schedule adherence, time-off requests, forecasting |
| **Outbound Campaigns** | Campaign status, contact list management, agent assignment |
| **Quality Management** | Evaluations, calibrations, survey results |
| **Architect Flows** | IVR flow listing, publishing, and version history |
| **Integrations** | List/manage third-party integrations and credentials |
| **Audit** | Track configuration changes across the org |
| **Knowledge Base** | Search and manage KB articles for agent assist |
| **Journey / Web Deployments** | Customer journey data, web messaging deployments |

### Security

- Store credentials in a secrets manager (1Password, AWS Secrets Manager) rather than `.env` files in production
- Scope the OAuth client's roles to **read-only** unless write operations are explicitly needed
- Rotate client secrets on a schedule; the token cache in `auth.ts` handles in-flight expiry automatically
- Log all tool invocations (with sanitized params) to an audit trail

### Performance

- The analytics query tools (`query_conversation_details`, `query_queue_aggregates`) can be slow for large time ranges — add a configurable timeout and advise users to keep intervals under 24 hours per call
- Cache slow-changing reference data (queues, skills, presence definitions, wrap-up codes) in memory with a TTL of ~5 minutes to avoid redundant API calls

## License

MIT
