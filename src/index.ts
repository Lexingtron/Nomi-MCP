import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

interface NomiResponse {
  uuid: string;
  gender: "Male" | "Female" | "Non Binary";
  name: string;
  created: string;
  relationshipType: "Mentor" | "Friend" | "Romantic";
}

interface MessageResponse {
  sentMessage: {
    uuid: string;
    text: string;
    sent: string;
  };
  replyMessage: {
    uuid: string;
    text: string;
    sent: string;
  };
}

interface RoomResponse {
  uuid: string;
  name: string;
  note: string;
  created: string;
  backchannelingEnabled: boolean;
  nomis: Array<{
    uuid: string;
    name: string;
  }>;
}

class NomiAPIClient {
  private apiKey: string;
  private baseUrl = "https://api.nomi.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<any> {
    const headers: any = {
      Authorization: this.apiKey,
    };

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { type?: string } };
      throw new Error(
        `API Error: ${error.error?.type || response.statusText}`
      );
    }

    // Handle DELETE requests that return no content
    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  }

  // Nomi endpoints
  async listNomis() {
    return this.makeRequest("GET", "/nomis");
  }

  async getNomi(id: string) {
    return this.makeRequest("GET", `/nomis/${id}`);
  }

  async sendMessage(nomiId: string, messageText: string) {
    return this.makeRequest("POST", `/nomis/${nomiId}/chat`, {
      messageText,
    });
  }

  async getNomiAvatar(nomiId: string) {
    return this.makeRequest("GET", `/nomis/${nomiId}/avatar`);
  }

  // Room endpoints
  async listRooms() {
    return this.makeRequest("GET", "/rooms");
  }

  async createRoom(params: {
    name: string;
    note: string;
    backchannelingEnabled: boolean;
    nomiUuids: string[];
  }) {
    return this.makeRequest("POST", "/rooms", params);
  }

  async getRoom(roomId: string) {
    return this.makeRequest("GET", `/rooms/${roomId}`);
  }

  async updateRoom(
    roomId: string,
    params: {
      name?: string;
      note?: string;
      nomiUuids?: string[];
      backchannelingEnabled?: boolean;
    }
  ) {
    return this.makeRequest("PUT", `/rooms/${roomId}`, params);
  }

  async deleteRoom(roomId: string) {
    return this.makeRequest("DELETE", `/rooms/${roomId}`);
  }

  async sendRoomMessage(roomId: string, messageText: string) {
    return this.makeRequest("POST", `/rooms/${roomId}/chat`, {
      messageText,
    });
  }

  async requestNomiMessage(roomId: string, nomiUuid: string) {
    return this.makeRequest("POST", `/rooms/${roomId}/chat/request`, {
      nomiUuid,
    });
  }
}

// Initialize the MCP server
const server = new Server(
  {
    name: "nomi-ai-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Nomi Management Tools
      {
        name: "list_nomis",
        description: "List all Nomis associated with your account",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_nomi",
        description: "Get details of a specific Nomi",
        inputSchema: {
          type: "object",
          properties: {
            nomi_id: {
              type: "string",
              description: "UUID of the Nomi",
            },
          },
          required: ["nomi_id"],
        },
      },
      {
        name: "send_message_to_nomi",
        description: "Send a message to a specific Nomi and get their reply",
        inputSchema: {
          type: "object",
          properties: {
            nomi_id: {
              type: "string",
              description: "UUID of the Nomi",
            },
            message: {
              type: "string",
              description: "Message text to send",
            },
          },
          required: ["nomi_id", "message"],
        },
      },
      {
        name: "get_nomi_avatar",
        description: "Get the avatar URL of a specific Nomi",
        inputSchema: {
          type: "object",
          properties: {
            nomi_id: {
              type: "string",
              description: "UUID of the Nomi",
            },
          },
          required: ["nomi_id"],
        },
      },
      // Room Management Tools
      {
        name: "list_rooms",
        description: "List all rooms associated with your account",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "create_room",
        description: "Create a new room with one or more Nomis",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Room name (100 characters max)",
            },
            note: {
              type: "string",
              description: "Room note/description (1000 characters max)",
            },
            backchanneling_enabled: {
              type: "boolean",
              description: "Enable backchanneling for the room",
            },
            nomi_uuids: {
              type: "array",
              items: { type: "string" },
              description: "Array of Nomi UUIDs (min 1, max 10)",
            },
          },
          required: ["name", "note", "backchanneling_enabled", "nomi_uuids"],
        },
      },
      {
        name: "get_room",
        description: "Get details of a specific room",
        inputSchema: {
          type: "object",
          properties: {
            room_id: {
              type: "string",
              description: "UUID of the room",
            },
          },
          required: ["room_id"],
        },
      },
      {
        name: "update_room",
        description: "Update room information",
        inputSchema: {
          type: "object",
          properties: {
            room_id: {
              type: "string",
              description: "UUID of the room",
            },
            name: {
              type: "string",
              description: "New room name (optional)",
            },
            note: {
              type: "string",
              description: "New room note (optional)",
            },
            nomi_uuids: {
              type: "array",
              items: { type: "string" },
              description: "New list of Nomi UUIDs (optional)",
            },
            backchanneling_enabled: {
              type: "boolean",
              description: "Enable/disable backchanneling (optional)",
            },
          },
          required: ["room_id"],
        },
      },
      {
        name: "delete_room",
        description: "Delete a specific room",
        inputSchema: {
          type: "object",
          properties: {
            room_id: {
              type: "string",
              description: "UUID of the room to delete",
            },
          },
          required: ["room_id"],
        },
      },
      {
        name: "send_room_message",
        description: "Send a message in a specific room",
        inputSchema: {
          type: "object",
          properties: {
            room_id: {
              type: "string",
              description: "UUID of the room",
            },
            message: {
              type: "string",
              description: "Message text to send",
            },
          },
          required: ["room_id", "message"],
        },
      },
      {
        name: "request_nomi_message",
        description: "Request a specific Nomi to post a message in a room",
        inputSchema: {
          type: "object",
          properties: {
            room_id: {
              type: "string",
              description: "UUID of the room",
            },
            nomi_uuid: {
              type: "string",
              description: "UUID of the Nomi to request a message from",
            },
          },
          required: ["room_id", "nomi_uuid"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (!args) {
    throw new Error("No arguments provided");
  }
  
  // Get API key from environment variable
  const apiKey = process.env.NOMI_API_KEY;
  if (!apiKey) {
    throw new Error("NOMI_API_KEY environment variable not set");
  }

  const client = new NomiAPIClient(apiKey);

  try {
    let result: any;

    switch (name) {
      // Nomi Management
      case "list_nomis":
        result = await client.listNomis();
        break;

      case "get_nomi":
        result = await client.getNomi(args.nomi_id as string);
        break;

      case "send_message_to_nomi":
        result = await client.sendMessage(args.nomi_id as string, args.message as string);
        break;

      case "get_nomi_avatar":
        result = await client.getNomiAvatar(args.nomi_id as string);
        break;

      // Room Management
      case "list_rooms":
        result = await client.listRooms();
        break;

      case "create_room":
        result = await client.createRoom({
          name: args.name as string,
          note: args.note as string,
          backchannelingEnabled: args.backchanneling_enabled as boolean,
          nomiUuids: args.nomi_uuids as string[],
        });
        break;

      case "get_room":
        result = await client.getRoom(args.room_id as string);
        break;

      case "update_room":
        const updateParams: any = {};
        if (args.name !== undefined) updateParams.name = args.name as string;
        if (args.note !== undefined) updateParams.note = args.note as string;
        if (args.nomi_uuids !== undefined)
          updateParams.nomiUuids = args.nomi_uuids as string[];
        if (args.backchanneling_enabled !== undefined)
          updateParams.backchannelingEnabled = args.backchanneling_enabled as boolean;
        result = await client.updateRoom(args.room_id as string, updateParams);
        break;

      case "delete_room":
        result = await client.deleteRoom(args.room_id as string);
        break;

      case "send_room_message":
        result = await client.sendRoomMessage(args.room_id as string, args.message as string);
        break;

      case "request_nomi_message":
        result = await client.requestNomiMessage(
          args.room_id as string,
          args.nomi_uuid as string
        );
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Nomi AI MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});