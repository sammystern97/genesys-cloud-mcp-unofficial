import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

// ISO 8601 interval: "2024-01-01T00:00:00.000Z/2024-01-02T00:00:00.000Z"
const IntervalSchema = z
  .string()
  .describe('ISO 8601 interval string, e.g. "2024-01-01T00:00:00.000Z/2024-01-02T00:00:00.000Z"');

export function registerAnalyticsTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "query_conversation_details",
    "Query historical conversation details using the analytics API. Returns detailed records for conversations matching the specified filters within a time interval.",
    {
      interval: IntervalSchema,
      queueIds: z.array(z.string()).optional().describe("Filter by queue IDs"),
      userIds: z.array(z.string()).optional().describe("Filter by agent/user IDs"),
      mediaTypes: z
        .array(z.enum(["voice", "chat", "email", "message", "callback"]))
        .optional()
        .describe("Filter by media types"),
      pageSize: z.number().int().min(1).max(100).default(25).describe("Results per page"),
      pageNumber: z.number().int().positive().default(1).describe("Page number"),
    },
    async ({ interval, queueIds, userIds, mediaTypes, pageSize, pageNumber }) => {
      const conversationFilters = [];

      if (queueIds?.length) {
        conversationFilters.push({
          type: "or",
          predicates: queueIds.map((id) => ({
            type: "dimension",
            dimension: "queueId",
            operator: "matches",
            value: id,
          })),
        });
      }

      if (userIds?.length) {
        conversationFilters.push({
          type: "or",
          predicates: userIds.map((id) => ({
            type: "dimension",
            dimension: "userId",
            operator: "matches",
            value: id,
          })),
        });
      }

      if (mediaTypes?.length) {
        conversationFilters.push({
          type: "or",
          predicates: mediaTypes.map((mt) => ({
            type: "dimension",
            dimension: "mediaType",
            operator: "matches",
            value: mt,
          })),
        });
      }

      const body: Record<string, unknown> = {
        interval,
        paging: { pageSize, pageNumber },
        order: "asc",
        orderBy: "conversationStart",
      };
      if (conversationFilters.length) body.conversationFilters = conversationFilters;

      const result = await client.post("/analytics/conversations/details/query", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "query_queue_observations",
    "Query real-time queue observation metrics (current state: agents waiting, interactions waiting, etc.).",
    {
      queueIds: z.array(z.string()).min(1).describe("Queue IDs to observe"),
      metrics: z
        .array(z.string())
        .default([
          "oWaiting",
          "oInteracting",
          "oAlerting",
          "oOnQueueUsers",
          "oActiveUsers",
          "oMemberUsers",
        ])
        .describe("Metrics to retrieve"),
    },
    async ({ queueIds, metrics }) => {
      const body = {
        filter: {
          type: "or",
          predicates: queueIds.map((id) => ({
            type: "dimension",
            dimension: "queueId",
            operator: "matches",
            value: id,
          })),
        },
        metrics,
      };
      const result = await client.post("/analytics/queues/observations/query", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "query_agent_observations",
    "Query real-time agent observation metrics (current agent states, on-queue status, etc.).",
    {
      userIds: z.array(z.string()).min(1).describe("User/agent IDs to observe"),
      metrics: z
        .array(z.string())
        .default(["oOnQueueUsers", "oActiveUsers", "oInteracting"])
        .describe("Metrics to retrieve"),
    },
    async ({ userIds, metrics }) => {
      const body = {
        filter: {
          type: "or",
          predicates: userIds.map((id) => ({
            type: "dimension",
            dimension: "userId",
            operator: "matches",
            value: id,
          })),
        },
        metrics,
      };
      const result = await client.post("/analytics/users/observations/query", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "query_queue_aggregates",
    "Query historical aggregate metrics for queues over a time period (handle time, wait time, abandon rate, etc.).",
    {
      interval: IntervalSchema,
      queueIds: z.array(z.string()).min(1).describe("Queue IDs to aggregate"),
      metrics: z
        .array(z.string())
        .default([
          "nOffered",
          "nAnswered",
          "nAbandoned",
          "tAbandon",
          "tAnswered",
          "tHandle",
          "tTalk",
          "tAcw",
          "tWait",
        ])
        .describe("Metrics to aggregate"),
      granularity: z
        .string()
        .default("PT30M")
        .describe("ISO 8601 duration for bucketing, e.g. PT30M (30 min), PT1H (1 hour), P1D (1 day)"),
      groupBy: z
        .array(z.string())
        .default(["queueId", "mediaType"])
        .describe("Dimensions to group by"),
    },
    async ({ interval, queueIds, metrics, granularity, groupBy }) => {
      const body = {
        interval,
        granularity,
        groupBy,
        filter: {
          type: "or",
          predicates: queueIds.map((id) => ({
            type: "dimension",
            dimension: "queueId",
            operator: "matches",
            value: id,
          })),
        },
        metrics,
      };
      const result = await client.post("/analytics/queues/activity/query", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "query_flow_observations",
    "Query real-time Architect flow (IVR) observations.",
    {
      flowIds: z.array(z.string()).min(1).describe("Flow IDs to observe"),
      metrics: z
        .array(z.string())
        .default(["oFlow", "oFlowMilestone"])
        .describe("Metrics to retrieve"),
    },
    async ({ flowIds, metrics }) => {
      const body = {
        filter: {
          type: "or",
          predicates: flowIds.map((id) => ({
            type: "dimension",
            dimension: "flowId",
            operator: "matches",
            value: id,
          })),
        },
        metrics,
      };
      const result = await client.post("/analytics/flows/observations/query", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
