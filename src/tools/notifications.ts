import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerNotificationTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "list_notification_topics",
    "List all available notification topics that can be subscribed to via WebSocket (e.g., conversation events, presence changes, queue updates).",
    {
      expand: z.array(z.string()).optional().describe("Fields to expand, e.g. ['schema']"),
    },
    async ({ expand }) => {
      const params: Record<string, unknown> = {};
      if (expand?.length) params.expand = expand;
      const result = await client.get("/notifications/availabletopics", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_notification_channel",
    "Create a notification channel. Returns a WebSocket URI and channel ID. Connect to the WebSocket to receive real-time events for subscribed topics.",
    {},
    async () => {
      const result = await client.post("/notifications/channels", {});
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_notification_channels",
    "List existing notification channels for the authenticated OAuth client.",
    {},
    async () => {
      const result = await client.get("/notifications/channels");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_channel_subscriptions",
    "Get the topics currently subscribed to on a notification channel.",
    { channelId: z.string().describe("Notification channel ID") },
    async ({ channelId }) => {
      const result = await client.get(`/notifications/channels/${channelId}/subscriptions`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "subscribe_to_topics",
    "Subscribe a notification channel to one or more topics. After subscribing, events will be pushed over the channel's WebSocket.",
    {
      channelId: z.string().describe("Notification channel ID"),
      topics: z.array(z.string()).min(1).describe(
        "Topic IDs to subscribe to, e.g. ['v2.users.{userId}.conversations', 'v2.routing.queues.{queueId}.members']"
      ),
    },
    async ({ channelId, topics }) => {
      const body = topics.map((id) => ({ id }));
      const result = await client.post(
        `/notifications/channels/${channelId}/subscriptions`,
        body
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_channel_subscriptions",
    "Remove all subscriptions from a notification channel.",
    { channelId: z.string().describe("Notification channel ID") },
    async ({ channelId }) => {
      const result = await client.delete(`/notifications/channels/${channelId}/subscriptions`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
