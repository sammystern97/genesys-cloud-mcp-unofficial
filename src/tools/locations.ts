import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerLocationTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_locations",
    "List locations (physical office/site locations assigned to users and devices).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    },
    async ({ pageNumber, pageSize, sortOrder }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (sortOrder) params.sortOrder = sortOrder;
      const result = await client.get("/locations", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_location",
    "Get a specific location by ID.",
    {
      locationId: z.string().describe("Location ID (UUID)"),
      expand: z.array(z.string()).optional(),
    },
    async ({ locationId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get(`/locations/${locationId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "search_locations",
    "Search locations by name or address.",
    {
      q: z.string().describe("Search query string"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ q, pageNumber, pageSize }) => {
      const body = {
        query: [{ type: "TERM", fields: ["name", "address.street1", "address.city"], value: q }],
        pageNumber,
        pageSize,
      };
      const result = await client.post("/locations/search", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
