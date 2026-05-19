import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerAuditTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_audit_services",
    "List services that produce audit log entries (e.g., ArchitectService, ContactCenter, Users, etc.).",
    {},
    async () => {
      const result = await client.get("/audits/queryservices");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "query_audit_log",
    "Query the Genesys Cloud audit log for configuration changes and actions. Results are returned asynchronously — use get_audit_query_results with the returned transaction ID.",
    {
      interval: z.string().describe('ISO 8601 interval, e.g. "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z"'),
      serviceName: z.string().optional().describe("Filter by service name (from list_audit_services)"),
      userId: z.string().optional().describe("Filter by the user who performed the action"),
      entityType: z.string().optional().describe("Filter by entity type, e.g. 'QUEUE', 'USER', 'FLOW'"),
      action: z.string().optional().describe("Filter by action, e.g. 'CREATE', 'UPDATE', 'DELETE'"),
      pageSize: z.number().int().min(1).max(100).default(25),
      pageNumber: z.number().int().positive().default(1),
    },
    async ({ interval, serviceName, userId, entityType, action, pageSize, pageNumber }) => {
      const body: Record<string, unknown> = {
        interval,
        sort: [{ name: "timestamp", sortOrder: "DESC" }],
        pageSize,
        pageNumber,
      };

      const filters = [];
      if (serviceName) filters.push({ property: "ServiceName", value: [serviceName] });
      if (userId) filters.push({ property: "UserId", value: [userId] });
      if (entityType) filters.push({ property: "EntityType", value: [entityType] });
      if (action) filters.push({ property: "Action", value: [action] });
      if (filters.length) body.filters = filters;

      const result = await client.post("/audits/query", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_audit_query_results",
    "Get the results of a previously submitted audit log query.",
    {
      transactionId: z.string().describe("Transaction ID returned by query_audit_log"),
      pageSize: z.number().int().min(1).max(100).default(25),
      pageNumber: z.number().int().positive().default(1),
    },
    async ({ transactionId, pageSize, pageNumber }) => {
      const result = await client.get(
        `/audits/query/${transactionId}/results`,
        { pageSize, pageNumber }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_audit_query_status",
    "Check the status of an async audit query (RUNNING, COMPLETED, FAILED).",
    { transactionId: z.string().describe("Transaction ID returned by query_audit_log") },
    async ({ transactionId }) => {
      const result = await client.get(`/audits/query/${transactionId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "realtime_audit_query",
    "Perform a synchronous (real-time) audit query for recent events. Faster but limited to recent data — use query_audit_log for historical ranges.",
    {
      serviceName: z.string().describe("Service name to query (from list_audit_services)"),
      level: z.enum(["User", "System"]).optional(),
      pageSize: z.number().int().min(1).max(100).default(25),
      pageNumber: z.number().int().positive().default(1),
    },
    async ({ serviceName, level, pageSize, pageNumber }) => {
      const body: Record<string, unknown> = {
        serviceName,
        pageSize,
        pageNumber,
      };
      if (level) body.level = level;
      const result = await client.post("/audits/query/realtime", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
