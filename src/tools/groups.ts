import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";
import type { Group, GroupListing, AuthorizationRole, RoleListing } from "../types.js";

export function registerGroupTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_groups",
    "List groups in the Genesys Cloud organization.",
    {
      name: z.string().optional().describe("Filter groups by name"),
      type: z.enum(["official", "social", "group"]).optional().describe("Filter by group type"),
      pageNumber: z.number().int().positive().default(1).describe("Page number"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page"),
    },
    async ({ name, type, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (type) params.type = type;
      const result = await client.get<GroupListing>("/groups", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_group",
    "Get details of a specific group by its ID.",
    { groupId: z.string().describe("The group ID (UUID)") },
    async ({ groupId }) => {
      const group = await client.get<Group>(`/groups/${groupId}`);
      return { content: [{ type: "text", text: JSON.stringify(group, null, 2) }] };
    }
  );

  server.tool(
    "list_group_members",
    "List members of a specific group.",
    {
      groupId: z.string().describe("The group ID (UUID)"),
      pageNumber: z.number().int().positive().default(1).describe("Page number"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page"),
    },
    async ({ groupId, pageNumber, pageSize }) => {
      const result = await client.get(`/groups/${groupId}/members`, { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

export function registerAuthorizationTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_roles",
    "List authorization roles in the organization.",
    {
      name: z.string().optional().describe("Filter roles by name"),
      pageNumber: z.number().int().positive().default(1).describe("Page number"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page"),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get<RoleListing>("/authorization/roles", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_user_roles",
    "Get authorization roles assigned to a specific user.",
    { userId: z.string().describe("The user ID (UUID)") },
    async ({ userId }) => {
      const result = await client.get(`/authorization/subjects/${userId}/roles`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_organization",
    "Get information about the current Genesys Cloud organization.",
    {},
    async () => {
      const org = await client.get("/organizations/me");
      return { content: [{ type: "text", text: JSON.stringify(org, null, 2) }] };
    }
  );
}
