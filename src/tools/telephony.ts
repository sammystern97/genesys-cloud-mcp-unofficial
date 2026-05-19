import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GenesysClient } from "../client.js";

export function registerTelephonyTools(server: McpServer, client: GenesysClient): void {

  // ── Stations ────────────────────────────────────────────────────────────────

  server.tool(
    "list_stations",
    "List stations (physical or virtual phone endpoints registered to agents).",
    {
      name: z.string().optional(),
      webRtcUserId: z.string().optional().describe("Filter stations associated with a WebRTC user"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, webRtcUserId, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (webRtcUserId) params.webRtcUserId = webRtcUserId;
      const result = await client.get("/stations", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_station",
    "Get a specific station by ID.",
    { stationId: z.string().describe("Station ID (UUID)") },
    async ({ stationId }) => {
      const result = await client.get(`/stations/${stationId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Edges ───────────────────────────────────────────────────────────────────

  server.tool(
    "list_edges",
    "List Edge appliances (on-premises media gateway devices).",
    {
      name: z.string().optional(),
      siteId: z.string().optional().describe("Filter by site ID"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, siteId, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (siteId) params.site = siteId;
      const result = await client.get("/telephony/providers/edges", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_edge",
    "Get a specific Edge by ID.",
    { edgeId: z.string().describe("Edge ID (UUID)") },
    async ({ edgeId }) => {
      const result = await client.get(`/telephony/providers/edges/${edgeId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_edge_status",
    "Get the current operational status of an Edge appliance.",
    { edgeId: z.string().describe("Edge ID (UUID)") },
    async ({ edgeId }) => {
      const result = await client.get(`/telephony/providers/edges/${edgeId}/statuscode`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_edge_lines",
    "List lines (channels/ports) on an Edge appliance.",
    {
      edgeId: z.string().describe("Edge ID (UUID)"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ edgeId, pageNumber, pageSize }) => {
      const result = await client.get(
        `/telephony/providers/edges/${edgeId}/lines`,
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Sites ───────────────────────────────────────────────────────────────────

  server.tool(
    "list_sites",
    "List telephony sites (logical groupings of Edge infrastructure by physical location).",
    {
      name: z.string().optional(),
      managed: z.boolean().optional().describe("Filter managed (cloud) vs on-prem sites"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, managed, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (managed !== undefined) params.managed = managed;
      const result = await client.get("/telephony/providers/edges/sites", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_site",
    "Get a specific telephony site by ID.",
    { siteId: z.string().describe("Site ID (UUID)") },
    async ({ siteId }) => {
      const result = await client.get(`/telephony/providers/edges/sites/${siteId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_site_outbound_routes",
    "List outbound call routes configured for a telephony site.",
    { siteId: z.string().describe("Site ID (UUID)") },
    async ({ siteId }) => {
      const result = await client.get(
        `/telephony/providers/edges/sites/${siteId}/outboundroutes`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Phones ──────────────────────────────────────────────────────────────────

  server.tool(
    "list_phones",
    "List managed IP phones registered in the organization.",
    {
      name: z.string().optional(),
      siteId: z.string().optional(),
      phoneBaseSettingsId: z.string().optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, siteId, phoneBaseSettingsId, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (siteId) params.siteId = siteId;
      if (phoneBaseSettingsId) params.phoneBaseSettingsId = phoneBaseSettingsId;
      const result = await client.get("/telephony/providers/edges/phones", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_phone_base_settings",
    "List phone base settings (device templates that define phone capabilities and firmware).",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get(
        "/telephony/providers/edges/phonebasesettings",
        { pageNumber, pageSize }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Trunks ──────────────────────────────────────────────────────────────────

  server.tool(
    "list_trunks",
    "List trunks (SIP carrier connections) on Edge appliances.",
    {
      name: z.string().optional(),
      trunkType: z.enum(["EXTERNAL", "PHONE", "EDGE"]).optional(),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ name, trunkType, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (name) params.name = name;
      if (trunkType) params.trunkType = trunkType;
      const result = await client.get("/telephony/providers/edges/trunks", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_trunk_metrics",
    "Get real-time metrics (call counts, registration status) for a specific trunk.",
    { trunkId: z.string().describe("Trunk ID (UUID)") },
    async ({ trunkId }) => {
      const result = await client.get(`/telephony/providers/edges/trunks/${trunkId}/metrics`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── DID & Number Management ─────────────────────────────────────────────────

  server.tool(
    "list_did_pools",
    "List DID (Direct Inward Dialing) number pools.",
    {
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ pageNumber, pageSize }) => {
      const result = await client.get("/telephony/providers/edges/didpools", { pageNumber, pageSize });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_dids",
    "List individual DID numbers.",
    {
      phoneNumber: z.string().optional().describe("Filter by phone number"),
      pageNumber: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(25),
    },
    async ({ phoneNumber, pageNumber, pageSize }) => {
      const params: Record<string, unknown> = { pageNumber, pageSize };
      if (phoneNumber) params.phoneNumber = phoneNumber;
      const result = await client.get("/telephony/providers/edges/dids", params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
