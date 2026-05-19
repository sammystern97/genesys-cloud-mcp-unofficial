import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerCoachingTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_coaching_appointments",
    "List coaching appointments between supervisors and agents.",
    {
      userIds: z.array(z.string()).optional().describe("Filter by agent or supervisor user IDs"),
      interval: z.string().optional().describe("ISO 8601 interval for appointment date range"),
      statuses: z
        .array(z.enum(["Active", "Completed", "InvalidSchedule"]))
        .optional()
        .describe("Filter by appointment status"),
      facilitatorIds: z.array(z.string()).optional().describe("Filter by facilitator (supervisor) user IDs"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    },
    async ({ userIds, interval, statuses, facilitatorIds, pageNumber, pageSize, sortOrder }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (userIds?.length) params.userIds = userIds;
      if (interval) params.interval = interval;
      if (statuses?.length) params.statuses = statuses;
      if (facilitatorIds?.length) params.facilitatorIds = facilitatorIds;
      if (sortOrder) params.sortOrder = sortOrder;
      const result = await client.get("/coaching/appointments", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_coaching_appointment",
    "Get a specific coaching appointment by ID.",
    { appointmentId: z.string().describe("Coaching appointment ID (UUID)") },
    async ({ appointmentId }) => {
      const result = await client.get(`/coaching/appointments/${appointmentId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_coaching_appointment_annotations",
    "List annotations (notes) on a specific coaching appointment.",
    {
      appointmentId: z.string().describe("Coaching appointment ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ appointmentId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/coaching/appointments/${appointmentId}/annotations`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_coaching_appointment_statuses",
    "Get the status history of a coaching appointment (read receipts, completion tracking).",
    {
      appointmentId: z.string().describe("Coaching appointment ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ appointmentId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/coaching/appointments/${appointmentId}/statuses`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_coaching_notifications",
    "List coaching notifications for the authenticated user.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/coaching/notifications", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_coaching_summary",
    "Get a summary of coaching appointments and their statuses for an agent or the org.",
    {
      userId: z.string().optional().describe("Agent user ID to scope summary to one agent"),
      interval: z.string().optional().describe("ISO 8601 interval"),
    },
    async ({ userId, interval }) => {
      const params: Record<string, unknown> = {};
      if (userId) params.userId = userId;
      if (interval) params.interval = interval;
      const result = await client.get("/coaching/appointments/statuses/summary", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
