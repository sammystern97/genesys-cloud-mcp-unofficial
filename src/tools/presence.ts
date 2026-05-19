import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

// Genesys Cloud system presences
const SystemPresence = z.enum([
  "Available",
  "Away",
  "Busy",
  "Break",
  "Meal",
  "Meeting",
  "Training",
  "On Queue",
  "Offline",
]);

export function registerPresenceTools(server: McpServer, client: GenesysClient): void {

  server.tool(
    "get_user_presence",
    "Get the current presence (availability status) of a user.",
    { userId: z.string().describe("The user ID (UUID)") },
    async ({ userId }) => {
      const presence = await client.get(`/users/${userId}/presences/purecloud`);
      return { content: [{ type: "text", text: JSON.stringify(presence, null, 2) }] };
    }
  );

  server.tool(
    "set_user_presence",
    "Set the presence (availability status) of the authenticated user or a specified user.",
    {
      userId: z.string().describe('The user ID (UUID), or "me" for the authenticated user'),
      systemPresence: SystemPresence.describe("The system presence to set"),
      message: z.string().max(150).optional().describe("Optional status message (max 150 chars)"),
    },
    async ({ userId, systemPresence, message }) => {
      // First resolve the presence definition ID for the given system presence
      const definitions = await client.get<{
        entities: Array<{ id: string; systemPresence: string; languageLabels: Record<string, string> }>;
      }>("/presencedefinitions", { pageSize: 100 });

      const definition = definitions.entities.find(
        (d) => d.systemPresence.toLowerCase() === systemPresence.toLowerCase()
      );
      if (!definition) {
        throw new Error(`Could not find presence definition for "${systemPresence}"`);
      }

      const body: Record<string, unknown> = {
        presenceDefinition: { id: definition.id },
      };
      if (message) body.message = message;

      const result = await client.patch(`/users/${userId}/presences/purecloud`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_presence_definitions",
    "List all presence definitions (both system and custom) available in the organization.",
    {},
    async () => {
      const result = await client.get("/presencedefinitions", { pageSize: 100 });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_users_presence_bulk",
    "Get the current presence for multiple users at once.",
    {
      userIds: z.array(z.string()).min(1).max(50).describe("List of user IDs (max 50)"),
    },
    async ({ userIds }) => {
      // Fetch presences in parallel
      const results = await Promise.allSettled(
        userIds.map(async (id) => {
          const presence = await client.get(`/users/${id}/presences/purecloud`);
          return { userId: id, presence };
        })
      );

      const output = results.map((r, i) =>
        r.status === "fulfilled"
          ? r.value
          : { userId: userIds[i], error: r.reason?.message ?? "Unknown error" }
      );

      return { content: [{ type: "text", text: JSON.stringify(output, null, 2) }] };
    }
  );
}
