import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerQualityTools(server: McpServer, client: GenesysClient): void {

  // ── Evaluation Forms ────────────────────────────────────────────────────────

  server.tool(
    "list_evaluation_forms",
    "List quality evaluation forms.",
    {
      name: z.string().optional().describe("Filter by form name"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      expand: z.string().optional().describe("Comma-separated fields to expand"),
    },
    async ({ name, pageNumber, pageSize, expand }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (expand) params.expand = expand;
      const result = await client.get("/quality/forms/evaluations", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_evaluation_form",
    "Get a specific evaluation form by ID.",
    { formId: z.string().describe("Evaluation form ID (UUID)") },
    async ({ formId }) => {
      const result = await client.get(`/quality/forms/evaluations/${formId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Evaluations ─────────────────────────────────────────────────────────────

  server.tool(
    "query_evaluations",
    "Query completed quality evaluations with filters.",
    {
      interval: z.string().optional().describe('ISO 8601 interval, e.g. "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z"'),
      evaluatorUserId: z.string().optional().describe("Filter by evaluator user ID"),
      agentUserId: z.string().optional().describe("Filter by evaluated agent user ID"),
      queueId: z.string().optional().describe("Filter by queue ID"),
      formId: z.string().optional().describe("Filter by evaluation form ID"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
      expand: z.array(z.string()).optional(),
    },
    async ({ interval, evaluatorUserId, agentUserId, queueId, formId, pageNumber, pageSize, sortBy, sortOrder, expand }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (interval) params.interval = interval;
      if (evaluatorUserId) params.evaluatorUserId = evaluatorUserId;
      if (agentUserId) params.agentUserId = agentUserId;
      if (queueId) params.queueId = queueId;
      if (formId) params.formId = formId;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      if (expand?.length) params.expand = expand;
      const result = await client.get("/quality/evaluations/query", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation_evaluations",
    "Get all evaluations for a specific conversation.",
    {
      conversationId: z.string().describe("Conversation ID (UUID)"),
      expand: z.array(z.string()).optional().describe("Fields to expand, e.g. ['agent', 'evaluator', 'evaluationForm']"),
    },
    async ({ conversationId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get(
        `/quality/conversations/${conversationId}/evaluations`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_evaluation",
    "Get a specific evaluation by conversation and evaluation ID.",
    {
      conversationId: z.string().describe("Conversation ID (UUID)"),
      evaluationId: z.string().describe("Evaluation ID (UUID)"),
      expand: z.string().optional().describe("Fields to expand"),
    },
    async ({ conversationId, evaluationId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand) params.expand = expand;
      const result = await client.get(
        `/quality/conversations/${conversationId}/evaluations/${evaluationId}`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Calibrations ────────────────────────────────────────────────────────────

  server.tool(
    "list_calibrations",
    "List quality calibrations (sessions where evaluators score the same interaction to align standards).",
    {
      calibratorId: z.string().optional().describe("Filter by calibrator user ID"),
      conversationId: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ calibratorId, conversationId, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (calibratorId) params.calibratorId = calibratorId;
      if (conversationId) params.conversationId = conversationId;
      const result = await client.get("/quality/calibrations", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_calibration",
    "Get a specific calibration by ID.",
    {
      calibrationId: z.string().describe("Calibration ID (UUID)"),
      calibratorId: z.string().optional().describe("Filter by calibrator user ID"),
    },
    async ({ calibrationId, calibratorId }) => {
      const params: Record<string, unknown> = {};
      if (calibratorId) params.calibratorId = calibratorId;
      const result = await client.get(`/quality/calibrations/${calibrationId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Surveys ─────────────────────────────────────────────────────────────────

  server.tool(
    "list_survey_forms",
    "List post-contact survey forms.",
    {
      name: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      const result = await client.get("/quality/forms/surveys", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "query_surveys",
    "Query post-contact survey results.",
    {
      interval: z.string().optional().describe("ISO 8601 interval"),
      agentUserId: z.string().optional(),
      queueId: z.string().optional(),
      surveyFormId: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ interval, agentUserId, queueId, surveyFormId, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (interval) params.interval = interval;
      if (agentUserId) params.agentUserId = agentUserId;
      if (queueId) params.queueId = queueId;
      if (surveyFormId) params.surveyFormId = surveyFormId;
      const result = await client.get("/quality/surveys/scorable", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation_surveys",
    "Get post-contact survey results for a specific conversation.",
    { conversationId: z.string().describe("Conversation ID (UUID)") },
    async ({ conversationId }) => {
      const result = await client.get(`/quality/conversations/${conversationId}/surveys`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Agent Quality Summary ───────────────────────────────────────────────────

  server.tool(
    "get_agents_quality_scores",
    "Get aggregated quality scores for agents over a time period.",
    {
      interval: z.string().describe("ISO 8601 interval"),
      agentUserIds: z.array(z.string()).optional(),
      formId: z.string().optional(),
    },
    async ({ interval, agentUserIds, formId }) => {
      const params: Record<string, unknown> = { interval };
      if (agentUserIds?.length) params.agentUserId = agentUserIds;
      if (formId) params.formId = formId;
      const result = await client.get("/quality/agents/activity", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Feedback (Disputed Evaluations) ────────────────────────────────────────

  server.tool(
    "list_evaluation_aggregates",
    "Query aggregated evaluation metrics across agents, queues, and time.",
    {
      interval: z.string().describe("ISO 8601 interval"),
      groupBy: z.array(z.string()).default(["evaluatorId", "agentId"]),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ interval, groupBy, pageNumber, pageSize }) => {
      const body = { interval, groupBy, paging: { pageNumber, pageSize } };
      const result = await client.post("/quality/evaluations/query/aggregates", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
