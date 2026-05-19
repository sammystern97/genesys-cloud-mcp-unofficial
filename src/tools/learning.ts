import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerLearningTools(server: McpServer, client: GenesysClient): void {

  // ── Learning Modules ────────────────────────────────────────────────────────

  server.tool(
    "list_learning_modules",
    "List learning modules (training content created in the Learning platform).",
    {
      searchTerm: z.string().optional().describe("Filter by module name or description"),
      isArchived: z.boolean().optional().describe("Include archived modules"),
      isDraft: z.boolean().optional().describe("Include draft modules"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    },
    async ({ searchTerm, isArchived, isDraft, pageNumber, pageSize, sortBy, sortOrder }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (searchTerm) params.searchTerm = searchTerm;
      if (isArchived !== undefined) params.isArchived = isArchived;
      if (isDraft !== undefined) params.isDraft = isDraft;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      const result = await client.get("/learning/modules", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_learning_module",
    "Get a specific learning module by ID.",
    {
      moduleId: z.string().describe("Learning module ID (UUID)"),
      expand: z.array(z.string()).optional().describe("Fields to expand, e.g. ['coverArt']"),
    },
    async ({ moduleId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get(`/learning/modules/${moduleId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Assignments ─────────────────────────────────────────────────────────────

  server.tool(
    "list_learning_assignments",
    "List learning module assignments for agents.",
    {
      moduleId: z.string().optional().describe("Filter by learning module ID"),
      userId: z.string().optional().describe("Filter by assigned agent user ID"),
      assignmentState: z
        .enum(["Assigned", "InProgress", "Completed", "NotCompleted", "InvalidSchedule"])
        .optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
      expand: z.array(z.string()).optional(),
    },
    async ({ moduleId, userId, assignmentState, pageNumber, pageSize, sortBy, sortOrder, expand }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (moduleId) params.moduleId = moduleId;
      if (userId) params.userId = userId;
      if (assignmentState) params.assignmentState = assignmentState;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      if (expand?.length) params.expand = expand;
      const result = await client.get("/learning/assignments", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_learning_assignment",
    "Get a specific learning assignment by ID.",
    {
      assignmentId: z.string().describe("Learning assignment ID (UUID)"),
      expand: z.array(z.string()).optional(),
    },
    async ({ assignmentId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get(`/learning/assignments/${assignmentId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_learning_assignments_summary",
    "Get a summary of learning assignment completion rates across the organization.",
    {
      userId: z.string().optional().describe("Scope summary to a specific user"),
      moduleId: z.string().optional().describe("Scope summary to a specific module"),
    },
    async ({ userId, moduleId }) => {
      const params: Record<string, unknown> = {};
      if (userId) params.userId = userId;
      if (moduleId) params.moduleId = moduleId;
      const result = await client.get("/learning/assignments/summary", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
