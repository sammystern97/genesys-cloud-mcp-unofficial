import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerMessagingTools(server: McpServer, client: GenesysClient): void {

  // ── Messaging Integrations ──────────────────────────────────────────────────

  server.tool(
    "list_messaging_integrations",
    "List all messaging channel integrations (WhatsApp, SMS, Facebook Messenger, Instagram, Twitter/X, Line, etc.).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/messaging/integrations", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── WhatsApp ────────────────────────────────────────────────────────────────

  server.tool(
    "list_whatsapp_integrations",
    "List WhatsApp Business messaging integrations.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/messaging/integrations/whatsapp", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_whatsapp_integration",
    "Get a specific WhatsApp integration by ID.",
    { integrationId: z.string().describe("WhatsApp integration ID (UUID)") },
    async ({ integrationId }) => {
      const result = await client.get(`/messaging/integrations/whatsapp/${integrationId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── SMS ─────────────────────────────────────────────────────────────────────

  server.tool(
    "list_sms_integrations",
    "List SMS messaging integrations and associated phone numbers.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/messaging/integrations/sms", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_sms_integration",
    "Get a specific SMS integration by ID.",
    { integrationId: z.string().describe("SMS integration ID (UUID)") },
    async ({ integrationId }) => {
      const result = await client.get(`/messaging/integrations/sms/${integrationId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Facebook ────────────────────────────────────────────────────────────────

  server.tool(
    "list_facebook_integrations",
    "List Facebook Messenger integrations.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/messaging/integrations/facebook", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Instagram ───────────────────────────────────────────────────────────────

  server.tool(
    "list_instagram_integrations",
    "List Instagram Direct Message integrations.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/messaging/integrations/instagram", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Twitter / X ─────────────────────────────────────────────────────────────

  server.tool(
    "list_twitter_integrations",
    "List Twitter/X Direct Message integrations.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/messaging/integrations/twitter", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Open Messaging ──────────────────────────────────────────────────────────

  server.tool(
    "list_open_messaging_integrations",
    "List Open Messaging integrations (custom third-party messaging channels connected via the Open Messaging API).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/messaging/integrations/open", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_open_messaging_integration",
    "Get a specific Open Messaging integration by ID.",
    { integrationId: z.string().describe("Open messaging integration ID (UUID)") },
    async ({ integrationId }) => {
      const result = await client.get(`/messaging/integrations/open/${integrationId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Supported Content Profiles ──────────────────────────────────────────────

  server.tool(
    "list_supported_content_profiles",
    "List messaging supported content profiles (define which media types are allowed per channel).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/messaging/supportedcontent", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Messaging Settings ──────────────────────────────────────────────────────

  server.tool(
    "list_messaging_settings",
    "List messaging settings profiles (typing indicators, read receipts, etc.).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/messaging/settings", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Email Routing ───────────────────────────────────────────────────────────

  server.tool(
    "list_email_domains",
    "List email domains configured for inbound email routing.",
    {},
    async () => {
      const result = await client.get("/routing/email/domains");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_email_domain_routes",
    "List inbound email routing rules for an email domain.",
    {
      domainId: z.string().describe("Email domain ID"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ domainId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/routing/email/domains/${domainId}/routes`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
