import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerJourneyTools(server: McpServer, client: GenesysClient): void {

  // ── Segments ────────────────────────────────────────────────────────────────

  server.tool(
    "list_journey_segments",
    "List customer journey segments (audience conditions that classify visitors based on behavior or attributes).",
    {
      isActive: z.boolean().optional().describe("Filter by active status"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    },
    async ({ isActive, pageNumber, pageSize, sortBy, sortOrder }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (isActive !== undefined) params.isActive = isActive;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      const result = await client.get("/journey/segments", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_journey_segment",
    "Get a specific journey segment by ID.",
    { segmentId: z.string().describe("Segment ID (UUID)") },
    async ({ segmentId }) => {
      const result = await client.get(`/journey/segments/${segmentId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Action Maps ─────────────────────────────────────────────────────────────

  server.tool(
    "list_action_maps",
    "List journey action maps (rules that trigger proactive engagement actions when a visitor matches a segment).",
    {
      isActive: z.boolean().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ isActive, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (isActive !== undefined) params.isActive = isActive;
      const result = await client.get("/journey/actionmaps", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_action_map",
    "Get a specific journey action map by ID.",
    { actionMapId: z.string().describe("Action map ID (UUID)") },
    async ({ actionMapId }) => {
      const result = await client.get(`/journey/actionmaps/${actionMapId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Outcomes ────────────────────────────────────────────────────────────────

  server.tool(
    "list_journey_outcomes",
    "List journey outcomes (conversion goals tracked in the customer journey, e.g. purchase, form submission).",
    {
      isActive: z.boolean().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ isActive, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (isActive !== undefined) params.isActive = isActive;
      const result = await client.get("/journey/outcomes", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_journey_outcome",
    "Get a specific journey outcome by ID.",
    { outcomeId: z.string().describe("Outcome ID (UUID)") },
    async ({ outcomeId }) => {
      const result = await client.get(`/journey/outcomes/${outcomeId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Customer Sessions ───────────────────────────────────────────────────────

  server.tool(
    "get_customer_journey_sessions",
    "Get journey sessions for a specific customer, showing their browsing and interaction history.",
    {
      customerId: z.string().describe("Customer ID (external or internal)"),
      customerIdType: z.enum(["cookie", "email", "phone", "external"]).default("cookie"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ customerId, customerIdType, pageNumber, pageSize }) => {
      const result = await client.get(
        `/journey/customers/${customerIdType}/${customerId}/journeys/sessions`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_journey_session",
    "Get details of a specific customer journey session.",
    { sessionId: z.string().describe("Session ID") },
    async ({ sessionId }) => {
      const result = await client.get(`/journey/sessions/${sessionId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_session_segments",
    "Get journey segments that the customer matched during a specific session.",
    { sessionId: z.string().describe("Session ID") },
    async ({ sessionId }) => {
      const result = await client.get(`/journey/sessions/${sessionId}/segments`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Web Deployments ─────────────────────────────────────────────────────────

  server.tool(
    "list_web_deployments",
    "List web deployments (JavaScript snippets deployed on websites to enable chat, cobrowse, and journey tracking).",
    {},
    async () => {
      const result = await client.get("/webdeployments/deployments");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_web_deployment",
    "Get a specific web deployment by ID.",
    { deploymentId: z.string().describe("Web deployment ID (UUID)") },
    async ({ deploymentId }) => {
      const result = await client.get(`/webdeployments/deployments/${deploymentId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_web_deployment_configurations",
    "List web deployment configurations (settings for web chat, messaging, and cobrowse behaviour).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/webdeployments/configurations", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Action Templates ────────────────────────────────────────────────────────

  server.tool(
    "list_action_templates",
    "List journey action templates (reusable content templates for proactive engagement, e.g. chat invites, content cards).",
    {
      isActive: z.boolean().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ isActive, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (isActive !== undefined) params.isActive = isActive;
      const result = await client.get("/journey/actiontemplates", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
