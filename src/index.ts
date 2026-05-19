#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GenesysClient } from "./client.js";
import type { GenesysConfig, GenesysRegion } from "./types.js";
import { REGION_BASE_URLS } from "./types.js";

// ── Existing tool groups ────────────────────────────────────────────────────
import { registerUserTools } from "./tools/users.js";
import { registerConversationTools } from "./tools/conversations.js";
import { registerRoutingTools } from "./tools/routing.js";
import { registerAnalyticsTools } from "./tools/analytics.js";
import { registerPresenceTools } from "./tools/presence.js";
import { registerGroupTools, registerAuthorizationTools } from "./tools/groups.js";

// ── AI Portfolio ────────────────────────────────────────────────────────────
import {
  registerAssistantTools,
  registerKnowledgeTools,
  registerSpeechTextAnalyticsTools,
  registerPredictiveRoutingTools,
  registerNluTools,
  registerBotTools,
  registerAgentPerformanceAITools,
} from "./tools/ai.js";

// ── Operations ──────────────────────────────────────────────────────────────
import { registerWorkforceTools } from "./tools/workforce.js";
import { registerOutboundTools } from "./tools/outbound.js";
import { registerQualityTools } from "./tools/quality.js";
import { registerFlowTools } from "./tools/flows.js";
import { registerRecordingTools } from "./tools/recordings.js";

// ── Channels & Infrastructure ───────────────────────────────────────────────
import { registerTelephonyTools } from "./tools/telephony.js";
import { registerMessagingTools } from "./tools/messaging.js";

// ── Customer & Journey ──────────────────────────────────────────────────────
import { registerJourneyTools } from "./tools/journey.js";
import { registerExternalContactTools } from "./tools/external_contacts.js";

// ── People & Performance ────────────────────────────────────────────────────
import { registerGamificationTools } from "./tools/gamification.js";
import { registerLearningTools } from "./tools/learning.js";
import { registerCoachingTools } from "./tools/coaching.js";

// ── Platform ────────────────────────────────────────────────────────────────
import { registerAuditTools } from "./tools/audit.js";
import { registerIntegrationTools } from "./tools/integrations.js";
import { registerNotificationTools } from "./tools/notifications.js";
import { registerLocationTools } from "./tools/locations.js";

function getConfig(): GenesysConfig {
  const clientId = process.env.GENESYS_CLIENT_ID;
  const clientSecret = process.env.GENESYS_CLIENT_SECRET;
  const region = (process.env.GENESYS_REGION ?? "us-east-1") as GenesysRegion;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing required environment variables: GENESYS_CLIENT_ID and GENESYS_CLIENT_SECRET"
    );
  }

  if (!Object.keys(REGION_BASE_URLS).includes(region)) {
    throw new Error(
      `Invalid GENESYS_REGION "${region}". Valid values: ${Object.keys(REGION_BASE_URLS).join(", ")}`
    );
  }

  return { clientId, clientSecret, region };
}

async function main() {
  const config = getConfig();
  const client = new GenesysClient(config);

  const server = new McpServer({
    name: "genesys-cloud",
    version: "0.1.0",
  });

  // ── Core ──────────────────────────────────────────────────────────────────
  registerUserTools(server, client);
  registerConversationTools(server, client);
  registerRoutingTools(server, client);
  registerAnalyticsTools(server, client);
  registerPresenceTools(server, client);
  registerGroupTools(server, client);
  registerAuthorizationTools(server, client);

  // ── AI Portfolio ──────────────────────────────────────────────────────────
  registerAssistantTools(server, client);
  registerKnowledgeTools(server, client);
  registerSpeechTextAnalyticsTools(server, client);
  registerPredictiveRoutingTools(server, client);
  registerNluTools(server, client);
  registerBotTools(server, client);
  registerAgentPerformanceAITools(server, client);

  // ── Operations ────────────────────────────────────────────────────────────
  registerWorkforceTools(server, client);
  registerOutboundTools(server, client);
  registerQualityTools(server, client);
  registerFlowTools(server, client);
  registerRecordingTools(server, client);

  // ── Channels & Infrastructure ─────────────────────────────────────────────
  registerTelephonyTools(server, client);
  registerMessagingTools(server, client);

  // ── Customer & Journey ────────────────────────────────────────────────────
  registerJourneyTools(server, client);
  registerExternalContactTools(server, client);

  // ── People & Performance ──────────────────────────────────────────────────
  registerGamificationTools(server, client);
  registerLearningTools(server, client);
  registerCoachingTools(server, client);

  // ── Platform ──────────────────────────────────────────────────────────────
  registerAuditTools(server, client);
  registerIntegrationTools(server, client);
  registerNotificationTools(server, client);
  registerLocationTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.stderr.write(
    `Genesys Cloud MCP server running (region: ${config.region})\n`
  );
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err.message}\n`);
  process.exit(1);
});
