import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerExternalContactTools(server: McpServer, client: GenesysClient): void {

  // ── Contacts ────────────────────────────────────────────────────────────────

  server.tool(
    "list_external_contacts",
    "List external contacts in the organization's contact directory.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      sortOrder: z.enum(["asc", "desc"]).optional(),
      expand: z.array(z.string()).optional().describe("Fields to expand, e.g. ['externalOrganization']"),
    },
    async ({ pageNumber, pageSize, sortOrder, expand }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (sortOrder) params.sortOrder = sortOrder;
      if (expand?.length) params.expand = expand;
      const result = await client.get("/externalcontacts/contacts", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "search_external_contacts",
    "Search external contacts by name, email, phone, or other attributes.",
    {
      q: z.string().describe("Search query string"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      expand: z.array(z.string()).optional(),
    },
    async ({ q, pageNumber, pageSize, expand }) => {
      const body: Record<string, unknown> = {
        query: q,
        pageNumber,
        pageSize,
      };
      if (expand?.length) body.expand = expand;
      const result = await client.post("/externalcontacts/contacts/search", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_external_contact",
    "Get a specific external contact by ID.",
    {
      contactId: z.string().describe("External contact ID (UUID)"),
      expand: z.array(z.string()).optional(),
    },
    async ({ contactId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get(`/externalcontacts/contacts/${contactId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_external_contact_notes",
    "Get notes recorded against an external contact.",
    {
      contactId: z.string().describe("External contact ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ contactId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/externalcontacts/contacts/${contactId}/notes`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_external_contact_conversations",
    "Get conversation history for a specific external contact.",
    {
      contactId: z.string().describe("External contact ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ contactId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/externalcontacts/contacts/${contactId}/conversations`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Organizations ───────────────────────────────────────────────────────────

  server.tool(
    "list_external_organizations",
    "List external organizations (companies) in the contact directory.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      sortOrder: z.enum(["asc", "desc"]).optional(),
      expand: z.array(z.string()).optional().describe("Fields to expand, e.g. ['contacts', 'externalDataSources']"),
    },
    async ({ pageNumber, pageSize, sortOrder, expand }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (sortOrder) params.sortOrder = sortOrder;
      if (expand?.length) params.expand = expand;
      const result = await client.get("/externalcontacts/organizations", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "search_external_organizations",
    "Search external organizations by name.",
    {
      q: z.string().describe("Search query string"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ q, pageNumber, pageSize }) => {
      const result = await client.get("/externalcontacts/organizations/search", {
        q,
        pageNumber,
        pageSize,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_external_organization",
    "Get a specific external organization by ID.",
    {
      extOrgId: z.string().describe("External organization ID (UUID)"),
      expand: z.string().optional().describe("Comma-separated fields to expand"),
    },
    async ({ extOrgId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand) params.expand = expand;
      const result = await client.get(`/externalcontacts/organizations/${extOrgId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_external_org_contacts",
    "Get all contacts belonging to a specific external organization.",
    {
      extOrgId: z.string().describe("External organization ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ extOrgId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/externalcontacts/organizations/${extOrgId}/contacts`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_external_org_notes",
    "Get notes recorded against an external organization.",
    {
      extOrgId: z.string().describe("External organization ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ extOrgId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/externalcontacts/organizations/${extOrgId}/notes`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Relationships ───────────────────────────────────────────────────────────

  server.tool(
    "list_external_contact_relationships",
    "List relationships between an external contact and external organizations.",
    {
      contactId: z.string().describe("External contact ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      expand: z.string().optional(),
    },
    async ({ contactId, pageNumber, pageSize, expand }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (expand) params.expand = expand;
      const result = await client.get(
        `/externalcontacts/contacts/${contactId}/relationships`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
