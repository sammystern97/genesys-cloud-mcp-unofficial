import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

// ─────────────────────────────────────────────────────────────────────────────
// Assistants & Copilot
// ─────────────────────────────────────────────────────────────────────────────

export function registerAssistantTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_assistants",
    "List all AI assistants configured in the organization (used for Agent Copilot).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/assistants", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_assistant",
    "Get details of a specific AI assistant by ID.",
    {
      assistantId: z.string().describe("The assistant ID (UUID)"),
      expand: z.array(z.string()).optional().describe("Optional fields to expand, e.g. ['copilot']"),
    },
    async ({ assistantId, expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand.join(",");
      const result = await client.get(`/assistants/${assistantId}`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_assistant_copilot",
    "Get the Agent Copilot configuration for a specific assistant, including real-time suggestions and summarization settings.",
    { assistantId: z.string().describe("The assistant ID (UUID)") },
    async ({ assistantId }) => {
      const result = await client.get(`/assistants/${assistantId}/copilots`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation_suggestions",
    "Get real-time AI-generated agent assist suggestions for an active conversation (answer suggestions, knowledge article recommendations, next best actions).",
    {
      conversationId: z.string().describe("The conversation ID (UUID)"),
      type: z
        .enum(["Faq", "Article", "KnowledgeArticle", "ExternalLink"])
        .optional()
        .describe("Filter suggestions by type"),
    },
    async ({ conversationId, type }) => {
      const params: Record<string, unknown> = {};
      if (type) params.type = type;
      const result = await client.get(`/conversations/${conversationId}/suggestions`, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation_summary",
    "Get the AI-generated summary for a conversation (requires Copilot summarization to be enabled).",
    { conversationId: z.string().describe("The conversation ID (UUID)") },
    async ({ conversationId }) => {
      const result = await client.get(`/conversations/${conversationId}/summaries`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation_participant_suggestion",
    "Get AI suggestions for a specific participant within a conversation.",
    {
      conversationId: z.string().describe("The conversation ID (UUID)"),
      participantId: z.string().describe("The participant ID"),
    },
    async ({ conversationId, participantId }) => {
      const result = await client.get(
        `/conversations/${conversationId}/participants/${participantId}/suggestions`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Knowledge Base
// ─────────────────────────────────────────────────────────────────────────────

export function registerKnowledgeTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_knowledge_bases",
    "List all knowledge bases configured in the organization.",
    {
      publishedOnly: z.boolean().optional().describe("Return only published knowledge bases"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ publishedOnly, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (publishedOnly !== undefined) params.publishedOnly = publishedOnly;
      const result = await client.get("/knowledge/knowledgebases", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_knowledge_base",
    "Get details of a specific knowledge base by ID.",
    { knowledgeBaseId: z.string().describe("The knowledge base ID (UUID)") },
    async ({ knowledgeBaseId }) => {
      const result = await client.get(`/knowledge/knowledgebases/${knowledgeBaseId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "search_knowledge",
    "Search a knowledge base for articles matching a query. Used for agent assist and self-service scenarios.",
    {
      knowledgeBaseId: z.string().describe("The knowledge base ID (UUID)"),
      query: z.string().describe("The search query text"),
      pageSize: z.number().int().min(1).max(100).default(10),
      pageNumber: z.number().int().positive().default(1),
    },
    async ({ knowledgeBaseId, query, pageSize, pageNumber }) => {
      const body = { query, pageSize, pageNumber };
      const result = await client.post(
        `/knowledge/knowledgebases/${knowledgeBaseId}/search`,
        body
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_knowledge_documents",
    "List documents (articles) in a knowledge base.",
    {
      knowledgeBaseId: z.string().describe("The knowledge base ID (UUID)"),
      state: z.enum(["Draft", "Published", "Archived"]).optional().describe("Filter by document state"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ knowledgeBaseId, state, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (state) params.state = state;
      const result = await client.get(
        `/knowledge/knowledgebases/${knowledgeBaseId}/documents`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_knowledge_document",
    "Get a specific knowledge base document/article by ID.",
    {
      knowledgeBaseId: z.string().describe("The knowledge base ID (UUID)"),
      documentId: z.string().describe("The document ID (UUID)"),
    },
    async ({ knowledgeBaseId, documentId }) => {
      const result = await client.get(
        `/knowledge/knowledgebases/${knowledgeBaseId}/documents/${documentId}`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_knowledge_categories",
    "List categories in a knowledge base.",
    {
      knowledgeBaseId: z.string().describe("The knowledge base ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ knowledgeBaseId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/knowledge/knowledgebases/${knowledgeBaseId}/categories`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "query_knowledge_feedback",
    "Get feedback records for knowledge articles (thumbs up/down, click-through data).",
    {
      knowledgeBaseId: z.string().describe("The knowledge base ID (UUID)"),
      startInterval: z.string().optional().describe("ISO 8601 start datetime"),
      endInterval: z.string().optional().describe("ISO 8601 end datetime"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ knowledgeBaseId, startInterval, endInterval, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (startInterval) params.startInterval = startInterval;
      if (endInterval) params.endInterval = endInterval;
      const result = await client.get(
        `/knowledge/knowledgebases/${knowledgeBaseId}/documents/feedback`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Speech & Text Analytics
// ─────────────────────────────────────────────────────────────────────────────

export function registerSpeechTextAnalyticsTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "get_speech_text_analytics_settings",
    "Get Speech & Text Analytics settings for the organization (transcription, sentiment, topic detection config).",
    {},
    async () => {
      const result = await client.get("/speechandtextanalytics/settings");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_sta_programs",
    "List Speech & Text Analytics programs (collections of topics used to categorize conversations).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      publishedOnly: z.boolean().optional(),
    },
    async ({ pageNumber, pageSize, publishedOnly }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (publishedOnly !== undefined) params.publishedOnly = publishedOnly;
      const result = await client.get("/speechandtextanalytics/programs", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_sta_program",
    "Get a specific Speech & Text Analytics program by ID.",
    { programId: z.string().describe("The program ID (UUID)") },
    async ({ programId }) => {
      const result = await client.get(`/speechandtextanalytics/programs/${programId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_sta_topics",
    "List Speech & Text Analytics topics (keyword/phrase sets used to detect conversation themes).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
      publishedOnly: z.boolean().optional(),
    },
    async ({ pageNumber, pageSize, publishedOnly }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (publishedOnly !== undefined) params.publishedOnly = publishedOnly;
      const result = await client.get("/speechandtextanalytics/topics", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_sta_topic",
    "Get a specific Speech & Text Analytics topic by ID.",
    { topicId: z.string().describe("The topic ID (UUID)") },
    async ({ topicId }) => {
      const result = await client.get(`/speechandtextanalytics/topics/${topicId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "query_sta_conversations",
    "Search conversations by Speech & Text Analytics attributes: sentiment, topics detected, transcription availability.",
    {
      interval: z.string().describe('ISO 8601 interval, e.g. "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z"'),
      queueIds: z.array(z.string()).optional(),
      userIds: z.array(z.string()).optional(),
      topicIds: z.array(z.string()).optional().describe("Filter conversations where these topics were detected"),
      minSentimentScore: z.number().min(-100).max(100).optional().describe("Minimum sentiment score (-100 to 100)"),
      maxSentimentScore: z.number().min(-100).max(100).optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ interval, queueIds, userIds, topicIds, minSentimentScore, maxSentimentScore, pageNumber, pageSize }) => {
      const body: Record<string, unknown> = {
        interval,
        paging: { pageNumber, pageSize },
      };
      const filters = [];
      if (queueIds?.length) {
        filters.push({ type: "or", predicates: queueIds.map(id => ({ dimension: "queueId", value: id })) });
      }
      if (userIds?.length) {
        filters.push({ type: "or", predicates: userIds.map(id => ({ dimension: "userId", value: id })) });
      }
      if (topicIds?.length) {
        filters.push({ type: "or", predicates: topicIds.map(id => ({ dimension: "topicId", value: id })) });
      }
      if (filters.length) body.conversationFilters = filters;
      if (minSentimentScore !== undefined) body.minSentimentScore = minSentimentScore;
      if (maxSentimentScore !== undefined) body.maxSentimentScore = maxSentimentScore;

      const result = await client.post("/speechandtextanalytics/conversations/query", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation_transcription",
    "Get the full speech-to-text transcript for a conversation.",
    { conversationId: z.string().describe("The conversation ID (UUID)") },
    async ({ conversationId }) => {
      const result = await client.get(`/speechandtextanalytics/conversations/${conversationId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation_categories",
    "Get Speech & Text Analytics category classifications detected in a conversation.",
    { conversationId: z.string().describe("The conversation ID (UUID)") },
    async ({ conversationId }) => {
      const result = await client.get(
        `/speechandtextanalytics/conversations/${conversationId}/categories`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_sta_categories",
    "List Speech & Text Analytics categories defined in the organization.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/speechandtextanalytics/categories", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Predictive Routing
// ─────────────────────────────────────────────────────────────────────────────

export function registerPredictiveRoutingTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_predictors",
    "List Predictive Routing predictors (ML models trained to route interactions to best-fit agents).",
    {
      queueIds: z.array(z.string()).optional().describe("Filter predictors by queue IDs"),
    },
    async ({ queueIds }) => {
      const params: Record<string, unknown> = {};
      if (queueIds?.length) params.queueId = queueIds;
      const result = await client.get("/routing/predictors", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_predictor",
    "Get a specific Predictive Routing predictor by ID.",
    { predictorId: z.string().describe("The predictor ID (UUID)") },
    async ({ predictorId }) => {
      const result = await client.get(`/routing/predictors/${predictorId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_queue_estimated_wait_time",
    "Get the Predictive Routing estimated wait time for a queue.",
    {
      queueId: z.string().describe("The queue ID (UUID)"),
      conversationId: z.string().optional().describe("Specific conversation ID for personalized EWT"),
    },
    async ({ queueId, conversationId }) => {
      const params: Record<string, unknown> = {};
      if (conversationId) params.conversationId = conversationId;
      const result = await client.get(
        `/routing/queues/${queueId}/estimatedwaittime`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_agent_best_points",
    "Get Predictive Routing best-fit agent scoring metrics for a queue's recent interactions.",
    { queueId: z.string().describe("The queue ID (UUID)") },
    async ({ queueId }) => {
      const result = await client.get(`/analytics/queues/${queueId}/agentassistance`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Language Understanding (NLU)
// ─────────────────────────────────────────────────────────────────────────────

export function registerNluTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_nlu_domains",
    "List Natural Language Understanding (NLU) domains used in bot and flow integrations.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/languageunderstanding/domains", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_nlu_domain",
    "Get a specific NLU domain by ID.",
    { domainId: z.string().describe("The NLU domain ID (UUID)") },
    async ({ domainId }) => {
      const result = await client.get(`/languageunderstanding/domains/${domainId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_nlu_domain_versions",
    "List versions of an NLU domain.",
    {
      domainId: z.string().describe("The NLU domain ID (UUID)"),
      includeTrainingStatus: z.boolean().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ domainId, includeTrainingStatus, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (includeTrainingStatus !== undefined) params.includeTrainingStatus = includeTrainingStatus;
      const result = await client.get(
        `/languageunderstanding/domains/${domainId}/versions`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "detect_nlu_intent",
    "Run intent detection against an NLU domain version for a given utterance. Useful for testing NLU models.",
    {
      domainId: z.string().describe("The NLU domain ID (UUID)"),
      domainVersionId: z.string().describe("The NLU domain version ID (UUID)"),
      utterance: z.string().describe("The text utterance to classify"),
      language: z.string().default("en-us").describe("Language code, e.g. en-us"),
    },
    async ({ domainId, domainVersionId, utterance, language }) => {
      const body = { input: { text: utterance }, language };
      const result = await client.post(
        `/languageunderstanding/domains/${domainId}/versions/${domainVersionId}/detect`,
        body
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_nlu_intents",
    "List intents defined in an NLU domain version.",
    {
      domainId: z.string().describe("The NLU domain ID (UUID)"),
      domainVersionId: z.string().describe("The NLU domain version ID (UUID)"),
    },
    async ({ domainId, domainVersionId }) => {
      const result = await client.get(
        `/languageunderstanding/domains/${domainId}/versions/${domainVersionId}`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bot Connectors
// ─────────────────────────────────────────────────────────────────────────────

export function registerBotTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_bot_connectors",
    "List bot connector integrations configured in the organization.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/integrations", {
        pageNumber,
        pageSize,
        integrationType: "purecloud-botconnector",
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_bots",
    "List bots available through a specific bot connector integration.",
    {
      integrationId: z.string().describe("The bot connector integration ID"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ integrationId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/integrations/botconnector/${integrationId}/bots`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_bot_summaries",
    "Get summary information for all bots in a bot connector integration.",
    {
      integrationId: z.string().describe("The bot connector integration ID"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ integrationId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/integrations/botconnector/${integrationId}/bots/summaries`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_genesys_bots",
    "List Genesys-native bots (Digital Bot Flows and Voice Bot Flows built in Architect).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/chatbots/settings", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Agent Coach & Scorecards (Performance AI)
// ─────────────────────────────────────────────────────────────────────────────

export function registerAgentPerformanceAITools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_performance_profiles",
    "List gamification performance profiles (used by AI-powered performance management).",
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
    "get_agent_scorecard",
    "Get an agent's scorecard data from a gamification performance profile.",
    {
      profileId: z.string().describe("Performance profile ID"),
      userId: z.string().describe("Agent user ID"),
      workday: z.string().optional().describe("ISO 8601 date, e.g. 2024-01-15"),
    },
    async ({ profileId, userId, workday }) => {
      const params: Record<string, unknown> = {};
      if (workday) params.workday = workday;
      const result = await client.get(
        `/gamification/profiles/${profileId}/users/${userId}/points/alltime`,
        params
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
