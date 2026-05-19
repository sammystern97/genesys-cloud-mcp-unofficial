import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";
import type { GenesysUser, UserListing } from "../types.js";

export function registerUserTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "get_me",
    "Get the authenticated user's profile, including name, email, department, title, and current presence.",
    {},
    async () => {
      const user = await client.get<GenesysUser>("/users/me", {
        expand: "presence,profileSkills,certifications,locations,groups,superiors,directReports",
      });
      return { content: [{ type: "text", text: JSON.stringify(user, null, 2) }] };
    }
  );

  server.tool(
    "get_user",
    "Get a Genesys Cloud user by their user ID.",
    { userId: z.string().describe("The Genesys Cloud user ID (UUID)") },
    async ({ userId }) => {
      const user = await client.get<GenesysUser>(`/users/${userId}`, {
        expand: "presence,profileSkills,certifications,locations,groups,superiors,directReports",
      });
      return { content: [{ type: "text", text: JSON.stringify(user, null, 2) }] };
    }
  );

  server.tool(
    "search_users",
    "Search for Genesys Cloud users by name, email, or username. Returns a paginated list.",
    {
      query: z.string().describe("Search query (name, email, or username)"),
      pageNumber: z.number().int().positive().default(1).describe("Page number (default 1)"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page, max 100 (default 25)"),
    },
    async ({ query, pageNumber, pageSize }) => {
      const body = {
        query: [{ type: "TERM", fields: ["name", "email", "username"], value: query }],
        pageNumber,
        pageSize,
        expand: ["presence"],
        sortOrder: "ASC",
        sortBy: "name",
      };
      const result = await client.post<UserListing>("/users/search", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_users",
    "List Genesys Cloud users with optional filtering by department or state.",
    {
      pageNumber: z.number().int().positive().default(1).describe("Page number (default 1)"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page, max 100 (default 25)"),
      state: z.enum(["active", "inactive", "deleted", "any"]).default("active").describe("Filter by user state"),
      department: z.string().optional().describe("Filter by department name"),
    },
    async ({ pageNumber, pageSize, state, department }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize, state };
      if (department) params.department = department;
      const result = await client.get<UserListing>("/users", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
