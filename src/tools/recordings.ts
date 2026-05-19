import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerRecordingTools(server: McpServer, client: GenesysClient): void {

  // ── Recording Queries ───────────────────────────────────────────────────────

  server.tool(
    "get_recording",
    "Get a specific recording for a conversation. Returns metadata and a signed download URL.",
    {
      conversationId: z.string().describe("Conversation ID (UUID)"),
      recordingId: z.string().describe("Recording ID (UUID)"),
      formatId: z.string().optional().describe("Media format, e.g. WEBM, MP3, WAV, MP4"),
    },
    async ({ conversationId, recordingId, formatId }) => {
      const params: Record<string, unknown> = {};
      if (formatId) params.formatId = formatId;
      const result = await client.get(
        `/conversations/${conversationId}/recordings/${recordingId}`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_conversation_recordings",
    "List all recordings for a specific conversation.",
    { conversationId: z.string().describe("Conversation ID (UUID)") },
    async ({ conversationId }) => {
      const result = await client.get(`/conversations/${conversationId}/recordings`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Bulk Recording Jobs ─────────────────────────────────────────────────────

  server.tool(
    "create_recording_bulk_job",
    "Create a bulk recording export job to retrieve multiple recordings at once.",
    {
      conversationQuery: z.object({
        interval: z.string().describe("ISO 8601 interval for conversation start times"),
        mediaType: z.enum(["CALL", "CHAT", "EMAIL", "MESSAGE", "CALLBACK"]).optional(),
        queueIds: z.array(z.string()).optional(),
        userIds: z.array(z.string()).optional(),
      }).describe("Query to select which conversations to export"),
      exportFormat: z.string().default("WEBM").describe("Export format: WEBM, MP3, WAV, MP4"),
    },
    async ({ conversationQuery, exportFormat }) => {
      const body = { conversationQuery, exportFormat };
      const result = await client.post("/recordings/jobs", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_recording_bulk_job",
    "Get the status and results of a bulk recording export job.",
    { jobId: z.string().describe("Bulk recording job ID") },
    async ({ jobId }) => {
      const result = await client.get(`/recordings/jobs/${jobId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Retention Policies ──────────────────────────────────────────────────────

  server.tool(
    "list_recording_retention_policies",
    "List recording media retention policies.",
    {
      name: z.string().optional(),
      hasErrors: z.boolean().optional().describe("Filter policies with configuration errors"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, hasErrors, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (hasErrors !== undefined) params.hasErrors = hasErrors;
      const result = await client.get("/recording/mediaretentionpolicies", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_recording_retention_policy",
    "Get a specific recording retention policy by ID.",
    { policyId: z.string().describe("Policy ID (UUID)") },
    async ({ policyId }) => {
      const result = await client.get(`/recording/mediaretentionpolicies/${policyId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Recording Settings ──────────────────────────────────────────────────────

  server.tool(
    "get_recording_settings",
    "Get organization-level recording settings (encryption, storage, etc.).",
    {},
    async () => {
      const result = await client.get("/recording/settings");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_recording_encryption_configs",
    "List recording encryption key configurations.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/recording/recordingkeys", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Screen Recordings ───────────────────────────────────────────────────────

  server.tool(
    "get_screen_recording_sessions",
    "Get screen recording sessions for a conversation.",
    { conversationId: z.string().describe("Conversation ID (UUID)") },
    async ({ conversationId }) => {
      const result = await client.get(`/screenrecording/sessions`, { conversationId });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Orphan Recordings ───────────────────────────────────────────────────────

  server.tool(
    "list_orphan_recordings",
    "List orphaned recordings (recordings not associated with any conversation).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/recording/orphans", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
