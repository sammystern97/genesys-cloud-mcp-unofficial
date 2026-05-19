import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerWorkforceTools(server: McpServer, client: GenesysClient): void {

  // ── Business Units ──────────────────────────────────────────────────────────

  server.tool(
    "list_business_units",
    "List WFM Business Units in the organization.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/workforcemanagement/businessunits", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_business_unit",
    "Get a specific WFM Business Unit by ID.",
    {
      buId: z.string().describe("Business unit ID (UUID)"),
      expand: z.array(z.string()).optional().describe("Fields to expand, e.g. ['settings']"),
    },
    async ({ buId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get(`/workforcemanagement/businessunits/${buId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Management Units ────────────────────────────────────────────────────────

  server.tool(
    "list_management_units",
    "List WFM Management Units.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/workforcemanagement/managementunits", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_management_unit_agents",
    "List agents belonging to a WFM Management Unit.",
    {
      muId: z.string().describe("Management unit ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ muId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/workforcemanagement/managementunits/${muId}/agents`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Schedules ───────────────────────────────────────────────────────────────

  server.tool(
    "list_bu_schedules",
    "List published schedules for a Business Unit.",
    {
      buId: z.string().describe("Business unit ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ buId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/workforcemanagement/businessunits/${buId}/scheduling/schedules`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_bu_schedule",
    "Get a specific Business Unit schedule.",
    {
      buId: z.string().describe("Business unit ID (UUID)"),
      scheduleId: z.string().describe("Schedule ID (UUID)"),
      expand: z.array(z.string()).optional().describe("Fields to expand"),
    },
    async ({ buId, scheduleId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get(
        `/workforcemanagement/businessunits/${buId}/scheduling/schedules/${scheduleId}`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_agent_schedule",
    "Get the WFM schedule for a specific agent within a date range.",
    {
      muId: z.string().describe("Management unit ID (UUID)"),
      userId: z.string().describe("Agent user ID (UUID)"),
      startDate: z.string().describe("Start date in ISO 8601 format, e.g. 2024-01-01T00:00:00Z"),
      endDate: z.string().describe("End date in ISO 8601 format"),
    },
    async ({ muId, userId, startDate, endDate }) => {
      const body = { startDate, endDate, userIds: [userId] };
      const result = await client.post(
        `/workforcemanagement/managementunits/${muId}/users/schedules/query`,
        body
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Forecasts ───────────────────────────────────────────────────────────────

  server.tool(
    "list_bu_forecasts",
    "List forecasts for a Business Unit.",
    {
      buId: z.string().describe("Business unit ID (UUID)"),
      weekDateRange: z.string().optional().describe("Week date range filter (ISO 8601 date)"),
    },
    async ({ buId, weekDateRange }) => {
      const params: Record<string, unknown> = {};
      if (weekDateRange) params.weekDateRange = weekDateRange;
      const result = await client.get(
        `/workforcemanagement/businessunits/${buId}/forecasts`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_bu_forecast",
    "Get a specific WFM forecast result for a Business Unit.",
    {
      buId: z.string().describe("Business unit ID (UUID)"),
      forecastId: z.string().describe("Forecast ID (UUID)"),
    },
    async ({ buId, forecastId }) => {
      const result = await client.get(
        `/workforcemanagement/businessunits/${buId}/forecasts/${forecastId}`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Adherence ───────────────────────────────────────────────────────────────

  server.tool(
    "query_adherence",
    "Query real-time schedule adherence for agents in a Management Unit.",
    {
      muId: z.string().describe("Management unit ID (UUID)"),
    },
    async ({ muId }) => {
      const result = await client.get(`/workforcemanagement/managementunits/${muId}/adherence`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "query_historical_adherence",
    "Query historical schedule adherence for agents.",
    {
      muId: z.string().describe("Management unit ID (UUID)"),
      startDate: z.string().describe("Start date ISO 8601"),
      endDate: z.string().describe("End date ISO 8601"),
      userIds: z.array(z.string()).optional().describe("Filter by specific user IDs"),
    },
    async ({ muId, startDate, endDate, userIds }) => {
      const body: Record<string, unknown> = { startDate, endDate };
      if (userIds?.length) body.userIds = userIds;
      const result = await client.post(
        `/workforcemanagement/managementunits/${muId}/historicaladherencequery`,
        body
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Time-Off ────────────────────────────────────────────────────────────────

  server.tool(
    "list_time_off_requests",
    "List time-off requests for agents in a Management Unit.",
    {
      muId: z.string().describe("Management unit ID (UUID)"),
      recentlyReviewed: z.boolean().optional().describe("Include only recently reviewed requests"),
    },
    async ({ muId, recentlyReviewed }) => {
      const params: Record<string, unknown> = {};
      if (recentlyReviewed !== undefined) params.recentlyReviewed = recentlyReviewed;
      const result = await client.get(
        `/workforcemanagement/managementunits/${muId}/timeoffrequests`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_time_off_request",
    "Get a specific time-off request.",
    {
      muId: z.string().describe("Management unit ID (UUID)"),
      timeOffRequestId: z.string().describe("Time-off request ID (UUID)"),
    },
    async ({ muId, timeOffRequestId }) => {
      const result = await client.get(
        `/workforcemanagement/managementunits/${muId}/timeoffrequests/${timeOffRequestId}`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Activity Codes ──────────────────────────────────────────────────────────

  server.tool(
    "list_activity_codes",
    "List WFM activity codes (schedule activity types like Break, Lunch, Training, etc.).",
    {
      muId: z.string().describe("Management unit ID (UUID)"),
    },
    async ({ muId }) => {
      const result = await client.get(
        `/workforcemanagement/managementunits/${muId}/activitycodes`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Planning Groups ─────────────────────────────────────────────────────────

  server.tool(
    "list_planning_groups",
    "List WFM planning groups for a Business Unit (queue groupings used in forecasting).",
    {
      buId: z.string().describe("Business unit ID (UUID)"),
    },
    async ({ buId }) => {
      const result = await client.get(
        `/workforcemanagement/businessunits/${buId}/planninggroups`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Work Plans ──────────────────────────────────────────────────────────────

  server.tool(
    "list_work_plans",
    "List work plans (shift templates) for a Management Unit.",
    {
      muId: z.string().describe("Management unit ID (UUID)"),
      expand: z.array(z.string()).optional().describe("Fields to expand, e.g. ['details']"),
    },
    async ({ muId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get(
        `/workforcemanagement/managementunits/${muId}/workplans`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_shift_trades",
    "List shift trade requests for a Management Unit.",
    {
      muId: z.string().describe("Management unit ID (UUID)"),
      weekDateId: z.string().describe("Week start date in yyyy-MM-dd format"),
    },
    async ({ muId, weekDateId }) => {
      const result = await client.get(
        `/workforcemanagement/managementunits/${muId}/shifttrades`,
        { weekDateId }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
