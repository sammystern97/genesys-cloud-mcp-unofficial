import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";
import type { Queue, QueueListing, QueueMember } from "../types.js";

export function registerRoutingTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_queues",
    "List routing queues. Optionally search by name.",
    {
      name: z.string().optional().describe("Filter queues by name (partial match)"),
      pageNumber: z.number().int().positive().default(1).describe("Page number (default 1)"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page (default 25)"),
      active: z.boolean().optional().describe("Filter by active status"),
    },
    async ({ name, pageNumber, pageSize, active }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (active !== undefined) params.active = active;
      const result = await client.get<QueueListing>("/routing/queues", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_queue",
    "Get details of a specific routing queue by its ID.",
    { queueId: z.string().describe("The queue ID (UUID)") },
    async ({ queueId }) => {
      const queue = await client.get<Queue>(`/routing/queues/${queueId}`);
      return { content: [{ type: "text", text: JSON.stringify(queue, null, 2) }] };
    }
  );

  server.tool(
    "list_queue_members",
    "List members (agents) of a routing queue.",
    {
      queueId: z.string().describe("The queue ID (UUID)"),
      pageNumber: z.number().int().positive().default(1).describe("Page number (default 1)"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page (default 25)"),
      joined: z.boolean().optional().describe("Filter to only joined (true) or unjoined (false) members"),
    },
    async ({ queueId, pageNumber, pageSize, joined }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (joined !== undefined) params.joined = joined;
      const result = await client.get<{ entities: QueueMember[]; total: number }>(
        `/routing/queues/${queueId}/members`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_user_queues",
    "Get queues that a specific user/agent is a member of.",
    {
      userId: z.string().describe("The user ID (UUID)"),
      pageNumber: z.number().int().positive().default(1).describe("Page number (default 1)"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page (default 25)"),
      joined: z.boolean().optional().describe("Filter to joined queues only"),
    },
    async ({ userId, pageNumber, pageSize, joined }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (joined !== undefined) params.joined = joined;
      const result = await client.get(`/users/${userId}/queues`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_skills",
    "List routing skills available in the organization.",
    {
      name: z.string().optional().describe("Filter skills by name"),
      pageNumber: z.number().int().positive().default(1).describe("Page number"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page"),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/routing/skills", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_wrap_up_codes",
    "List wrap-up codes (disposition codes) available in the organization.",
    {
      name: z.string().optional().describe("Filter by name"),
      pageNumber: z.number().int().positive().default(1).describe("Page number"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page"),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/routing/wrapupcodes", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
