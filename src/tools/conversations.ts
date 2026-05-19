import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";
import type { Conversation, ConversationListing } from "../types.js";

export function registerConversationTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_conversations",
    "List active (in-progress) conversations. Optionally filter by communication type.",
    {
      communicationType: z
        .enum(["call", "callback", "email", "message", "chat", "screenshare", "cobrowse"])
        .optional()
        .describe("Filter by media/communication type"),
    },
    async ({ communicationType }) => {
      const params: Record<string, unknown> = {};
      if (communicationType) params.communicationType = communicationType;
      const result = await client.get<ConversationListing>("/conversations", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation",
    "Get details of a specific conversation by its ID, including all participants and their states.",
    { conversationId: z.string().describe("The conversation ID (UUID)") },
    async ({ conversationId }) => {
      const conversation = await client.get<Conversation>(`/conversations/${conversationId}`);
      return { content: [{ type: "text", text: JSON.stringify(conversation, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation_messages",
    "Get messages for a messaging or chat conversation.",
    { conversationId: z.string().describe("The conversation ID (UUID)") },
    async ({ conversationId }) => {
      const messages = await client.get(`/conversations/messages/${conversationId}/messages`);
      return { content: [{ type: "text", text: JSON.stringify(messages, null, 2) }] };
    }
  );

  server.tool(
    "get_conversation_recordings",
    "Get recordings associated with a conversation.",
    { conversationId: z.string().describe("The conversation ID (UUID)") },
    async ({ conversationId }) => {
      const recordings = await client.get(`/conversations/${conversationId}/recordings`);
      return { content: [{ type: "text", text: JSON.stringify(recordings, null, 2) }] };
    }
  );

  server.tool(
    "get_user_conversations",
    "Get conversations for a specific agent/user that are currently active.",
    {
      userId: z.string().describe("The user ID (UUID)"),
      communicationType: z
        .enum(["call", "callback", "email", "message", "chat"])
        .optional()
        .describe("Filter by communication type"),
    },
    async ({ userId, communicationType }) => {
      const suffix = communicationType ? `/${communicationType}s` : "";
      const result = await client.get(`/users/${userId}/conversations${suffix}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
