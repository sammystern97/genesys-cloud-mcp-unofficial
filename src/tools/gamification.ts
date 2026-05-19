import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerGamificationTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_gamification_profiles",
    "List gamification performance profiles (define which KPIs are tracked and how agents are scored).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/gamification/profiles", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_gamification_profile",
    "Get a specific gamification performance profile by ID.",
    { profileId: z.string().describe("Performance profile ID (UUID)") },
    async ({ profileId }) => {
      const result = await client.get(`/gamification/profiles/${profileId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_gamification_leaderboard",
    "Get the gamification leaderboard for a performance profile over a time period.",
    {
      startWorkday: z.string().describe("Start workday in yyyy-MM-dd format"),
      endWorkday: z.string().describe("End workday in yyyy-MM-dd format"),
      metricId: z.string().optional().describe("Filter leaderboard to a specific metric ID"),
    },
    async ({ startWorkday, endWorkday, metricId }) => {
      const params: Record<string, unknown> = { startWorkday, endWorkday };
      if (metricId) params.metricId = metricId;
      const result = await client.get("/gamification/leaderboard", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_user_gamification_scores",
    "Get gamification scores for a specific agent over a date range.",
    {
      userId: z.string().describe("Agent user ID (UUID)"),
      startWorkday: z.string().describe("Start workday in yyyy-MM-dd format"),
      endWorkday: z.string().describe("End workday in yyyy-MM-dd format"),
    },
    async ({ userId, startWorkday, endWorkday }) => {
      const result = await client.get(
        `/gamification/users/${userId}/points/trends`,
        { startWorkday, endWorkday }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_user_gamification_insights",
    "Get insights comparing an agent's performance to their peers.",
    {
      userId: z.string().describe("Agent user ID (UUID)"),
      startWorkday: z.string().describe("Start workday in yyyy-MM-dd format"),
      endWorkday: z.string().describe("End workday in yyyy-MM-dd format"),
    },
    async ({ userId, startWorkday, endWorkday }) => {
      const result = await client.get(
        `/gamification/insights/user/${userId}`,
        { startWorkday, endWorkday }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_gamification_metrics",
    "List gamification metrics defined in a performance profile.",
    { profileId: z.string().describe("Performance profile ID (UUID)") },
    async ({ profileId }) => {
      const result = await client.get(`/gamification/profiles/${profileId}/metrics`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
