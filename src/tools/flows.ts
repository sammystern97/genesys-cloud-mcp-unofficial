import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerFlowTools(server: McpServer, client: GenesysClient): void {

  // ── Flows ───────────────────────────────────────────────────────────────────

  server.tool(
    "list_flows",
    "List Architect flows (IVR, InboundCall, InboundChat, InboundEmail, OutboundCall, DigitalBot, VoiceBot, etc.).",
    {
      type: z
        .array(
          z.enum([
            "flow",
            "inboundcall",
            "inboundchat",
            "inboundemail",
            "inboundshortmessage",
            "outboundcall",
            "securecall",
            "speech",
            "digitalbot",
            "voicebot",
            "workitem",
            "commonmodule",
          ])
        )
        .optional()
        .describe("Filter by flow type(s)"),
      name: z.string().optional(),
      publishVersionId: z.string().optional().describe("Filter by published version ID"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ type, name, publishVersionId, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (type?.length) params.type = type;
      if (name) params.name = name;
      if (publishVersionId) params.publishVersionId = publishVersionId;
      const result = await client.get("/flows", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_flow",
    "Get a specific Architect flow by ID.",
    {
      flowId: z.string().describe("Flow ID (UUID)"),
      deleted: z.boolean().optional().describe("Include deleted flows"),
    },
    async ({ flowId, deleted }) => {
      const params: Record<string, unknown> = {};
      if (deleted !== undefined) params.deleted = deleted;
      const result = await client.get(`/flows/${flowId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_flow_versions",
    "List published and draft versions of an Architect flow.",
    {
      flowId: z.string().describe("Flow ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ flowId, pageNumber, pageSize }) => {
      const result = await client.get(`/flows/${flowId}/versions`, { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_flow_version",
    "Get a specific version of an Architect flow.",
    {
      flowId: z.string().describe("Flow ID (UUID)"),
      versionId: z.string().describe("Version ID or 'latest'"),
    },
    async ({ flowId, versionId }) => {
      const result = await client.get(`/flows/${flowId}/versions/${versionId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Flow Outcomes & Milestones ──────────────────────────────────────────────

  server.tool(
    "list_flow_outcomes",
    "List Architect flow outcomes (used to track self-service completion in analytics).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/flows/outcomes", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_flow_milestones",
    "List Architect flow milestones (markers within flows used in reporting).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/flows/milestones", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Data Tables ─────────────────────────────────────────────────────────────

  server.tool(
    "list_data_tables",
    "List Architect data tables (key-value lookup tables used in flows).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      expand: z.string().optional().describe("Fields to expand, e.g. 'schema'"),
    },
    async ({ pageNumber, pageSize, expand }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (expand) params.expand = expand;
      const result = await client.get("/flows/datatables", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_data_table",
    "Get a specific Architect data table by ID.",
    {
      datatableId: z.string().describe("Data table ID (UUID)"),
      expand: z.string().optional().describe("Fields to expand, e.g. 'schema'"),
    },
    async ({ datatableId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand) params.expand = expand;
      const result = await client.get(`/flows/datatables/${datatableId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_data_table_rows",
    "List rows in an Architect data table.",
    {
      datatableId: z.string().describe("Data table ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      showBrief: z.boolean().optional().describe("Return only key column values"),
    },
    async ({ datatableId, pageNumber, pageSize, showBrief }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (showBrief !== undefined) params.showBrief = showBrief;
      const result = await client.get(`/flows/datatables/${datatableId}/rows`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_data_table_row",
    "Get a specific row from an Architect data table by its key.",
    {
      datatableId: z.string().describe("Data table ID (UUID)"),
      rowId: z.string().describe("The row key value"),
      expand: z.string().optional(),
    },
    async ({ datatableId, rowId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand) params.expand = expand;
      const result = await client.get(`/flows/datatables/${datatableId}/rows/${rowId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Prompts ─────────────────────────────────────────────────────────────────

  server.tool(
    "list_prompts",
    "List Architect user-defined audio prompts.",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/architect/prompts", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_prompt",
    "Get a specific Architect user prompt by ID.",
    { promptId: z.string().describe("Prompt ID (UUID)") },
    async ({ promptId }) => {
      const result = await client.get(`/architect/prompts/${promptId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_system_prompts",
    "List Architect system prompts (built-in platform audio prompts).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/architect/systemprompts", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Schedules (Routing) ─────────────────────────────────────────────────────

  server.tool(
    "list_routing_schedules",
    "List Architect routing schedules (date/time rules that control flow branching).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/architect/schedules", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_routing_schedule_groups",
    "List Architect routing schedule groups (collections of schedules evaluated in priority order).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/architect/schedulegroups", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Emergency Groups & IVR ──────────────────────────────────────────────────

  server.tool(
    "list_emergency_groups",
    "List Architect emergency groups (used to activate override routing during emergencies).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/architect/emergencygroups", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_ivr_configs",
    "List IVR DNIS configurations (maps phone numbers to Architect flows).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/architect/ivrs", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
