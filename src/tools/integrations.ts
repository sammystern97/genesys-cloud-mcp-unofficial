import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerIntegrationTools(server: McpServer, client: GenesysClient): void {

  // ── Integrations ────────────────────────────────────────────────────────────

  server.tool(
    "list_integrations",
    "List all integrations configured in the organization.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      expand: z.array(z.string()).optional().describe("Fields to expand, e.g. ['config.current', 'status']"),
      type: z.string().optional().describe("Filter by integration type, e.g. 'purecloud-salesforce'"),
    },
    async ({ pageNumber, pageSize, expand, type }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (expand?.length) params.expand = expand;
      if (type) params.integrationType = type;
      const result = await client.get("/integrations", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_integration",
    "Get a specific integration by ID.",
    {
      integrationId: z.string().describe("Integration ID (UUID)"),
      expand: z.array(z.string()).optional(),
    },
    async ({ integrationId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get(`/integrations/${integrationId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_integration_types",
    "List available integration types (CRM connectors, data dips, bots, etc.).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/integrations/types", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_integration_config",
    "Get the current configuration of an integration.",
    { integrationId: z.string().describe("Integration ID (UUID)") },
    async ({ integrationId }) => {
      const result = await client.get(`/integrations/${integrationId}/config/current`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Integration Actions (Data Dip / Automation) ─────────────────────────────

  server.tool(
    "list_integration_actions",
    "List integration actions (reusable API call definitions used in Architect flows and agent scripts).",
    {
      category: z.string().optional().describe("Filter by action category"),
      name: z.string().optional().describe("Filter by action name"),
      secure: z.boolean().optional().describe("Filter to secure (credential-bearing) actions only"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ category, name, secure, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (category) params.category = category;
      if (name) params.name = name;
      if (secure !== undefined) params.secure = secure;
      const result = await client.get("/integrations/actions", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_integration_action",
    "Get a specific integration action definition.",
    { actionId: z.string().describe("Integration action ID") },
    async ({ actionId }) => {
      const result = await client.get(`/integrations/actions/${actionId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_integration_action_schema",
    "Get the input/output JSON schema for an integration action.",
    {
      actionId: z.string().describe("Integration action ID"),
      fileName: z.enum(["input.json.schema", "output.json.schema"]).describe("Which schema file to retrieve"),
    },
    async ({ actionId, fileName }) => {
      const result = await client.get(`/integrations/actions/${actionId}/schemas/${fileName}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "execute_integration_action",
    "Execute an integration action with input parameters. Use for data dip lookups or CRM operations.",
    {
      actionId: z.string().describe("Integration action ID"),
      body: z.record(z.unknown()).describe("Input parameters as defined by the action's input schema"),
    },
    async ({ actionId, body }) => {
      const result = await client.post(`/integrations/actions/${actionId}/execute`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_integration_action_categories",
    "List categories used to organize integration actions.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/integrations/actions/categories", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Credentials ─────────────────────────────────────────────────────────────

  server.tool(
    "list_integration_credentials",
    "List integration credential sets (stored API keys, OAuth tokens, usernames/passwords for external systems).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/integrations/credentials", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
