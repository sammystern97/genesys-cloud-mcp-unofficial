import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerOutboundTools(server: McpServer, client: GenesysClient): void {

  // ── Campaigns ───────────────────────────────────────────────────────────────

  server.tool(
    "list_campaigns",
    "List outbound dialing campaigns.",
    {
      name: z.string().optional().describe("Filter by campaign name"),
      campaignStatus: z
        .enum(["on", "off", "complete", "stopping", "invalid", "forced_off", "forced_on"])
        .optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, campaignStatus, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (campaignStatus) params.campaignStatus = campaignStatus;
      const result = await client.get("/outbound/campaigns", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_campaign",
    "Get details of a specific outbound campaign by ID.",
    { campaignId: z.string().describe("Campaign ID (UUID)") },
    async ({ campaignId }) => {
      const result = await client.get(`/outbound/campaigns/${campaignId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_campaign_stats",
    "Get real-time statistics for an outbound campaign (calls placed, connected, abandoned, etc.).",
    { campaignId: z.string().describe("Campaign ID (UUID)") },
    async ({ campaignId }) => {
      const result = await client.get(`/outbound/campaigns/${campaignId}/stats`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_campaign_progress",
    "Get dialing progress for an outbound campaign (contacts attempted vs total).",
    { campaignId: z.string().describe("Campaign ID (UUID)") },
    async ({ campaignId }) => {
      const result = await client.get(`/outbound/campaigns/${campaignId}/progress`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Contact Lists ───────────────────────────────────────────────────────────

  server.tool(
    "list_contact_lists",
    "List outbound contact lists.",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/outbound/contactlists", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_contact_list",
    "Get a specific contact list by ID.",
    { contactListId: z.string().describe("Contact list ID (UUID)") },
    async ({ contactListId }) => {
      const result = await client.get(`/outbound/contactlists/${contactListId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_contact_list_contacts",
    "Get contacts from a contact list.",
    {
      contactListId: z.string().describe("Contact list ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ contactListId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/outbound/contactlists/${contactListId}/contacts`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_contact_list_export",
    "Get the import/export status or download URI for a contact list.",
    { contactListId: z.string().describe("Contact list ID (UUID)") },
    async ({ contactListId }) => {
      const result = await client.get(`/outbound/contactlists/${contactListId}/export`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Do Not Contact (DNC) ────────────────────────────────────────────────────

  server.tool(
    "list_dnc_lists",
    "List Do Not Contact (DNC) lists.",
    {
      name: z.string().optional(),
      dncSourceType: z.enum(["rds", "dnc.com", "gryphon", "internal"]).optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, dncSourceType, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (dncSourceType) params.dncSourceType = dncSourceType;
      const result = await client.get("/outbound/dncgroups", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_dnc_list",
    "Get a specific DNC list by ID.",
    { dncListId: z.string().describe("DNC list ID (UUID)") },
    async ({ dncListId }) => {
      const result = await client.get(`/outbound/dncgroups/${dncListId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Campaign Sequences ──────────────────────────────────────────────────────

  server.tool(
    "list_campaign_sequences",
    "List outbound campaign sequences (ordered sets of campaigns that run in sequence).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/outbound/sequences", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Callable Time Sets ──────────────────────────────────────────────────────

  server.tool(
    "list_callable_time_sets",
    "List callable time sets (rules defining when it is permissible to dial contacts).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/outbound/callabletimesets", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Rule Sets & Attempt Limits ──────────────────────────────────────────────

  server.tool(
    "list_attempt_limits",
    "List attempt limit sets (rules governing max retry attempts per contact).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/outbound/attemptlimits", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_rule_sets",
    "List outbound rule sets (call analysis response rules for answering machines, busy signals, etc.).",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/outbound/rulesets", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Event Log ───────────────────────────────────────────────────────────────

  server.tool(
    "get_outbound_event_log",
    "Get the outbound event log for diagnosing campaign issues.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      level: z.enum(["INFO", "WARNING", "ERROR"]).optional(),
    },
    async ({ pageNumber, pageSize, level }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (level) params.level = level;
      const result = await client.get("/outbound/events", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
