# Nomi AI MCP Server Setup Guide

Simple setup for Claude Desktop integration.

## Prerequisites

### Install Node.js (includes npm)
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS version
3. Run the installer (this also installs npm and git)

### Get Nomi API Key
1. Sign up/login at [nomi.ai](https://nomi.ai/)
2. Find your API key in settings
3. Copy it somewhere safe

## Setup Steps

### 1. Clone and Build

```bash
# Clone the repository 
git clone https://github.com/Lexingtron/Nomi-MCP.git
cd Nomi-MCP

# Install and build
npm install
npm run build
```

### 2. Add to Claude Desktop Config

**Windows**: Open `%APPDATA%\Claude\claude_desktop_config.json` and add:

```json
{
  "mcpServers": {
    "nomi-ai": {
      "command": "node",
      "args": ["C:\\full\\path\\to\\Nomi-MCP\\dist\\index.js"],
      "env": {
        "NOMI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Mac**: Open `~/Library/Application Support/Claude/claude_desktop_config.json` and add:

```json
{
  "mcpServers": {
    "nomi-ai": {
      "command": "/opt/homebrew/bin/node",
      "args": ["/full/path/to/Nomi-MCP/dist/index.js"],
      "env": {
        "NOMI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Replace:
- The path with your actual path to the Nomi-MCP folder (use `\\` on Windows, `/` on Mac)
- `your-api-key-here` with your Nomi API key

### 3. Restart Claude Desktop

That's it!

## Verification

Once set up, you should be able to use these tools in Claude Desktop:

- **Nomi Management**:
  - `list_nomis` - List all your Nomis
  - `get_nomi` - Get details of a specific Nomi
  - `send_message_to_nomi` - Send messages and get replies
  - `get_nomi_avatar` - Get Nomi avatar URLs

- **Room Management**:
  - `list_rooms` - List all your rooms
  - `create_room` - Create new rooms with multiple Nomis
  - `get_room` - Get room details
  - `update_room` - Update room settings
  - `delete_room` - Delete rooms
  - `send_room_message` - Send messages to rooms
  - `request_nomi_message` - Request specific Nomis to respond

## Example Usage

Try asking Claude Desktop:
- "List all my Nomis"
- "Send a message to [Nomi name] saying hello"
- "Create a new room with my favorite Nomis"

## Troubleshooting

1. **"NOMI_API_KEY environment variable not set"**
   - Make sure your API key is set as an environment variable
   - Try setting it directly in the Claude config (see step 4)

2. **"Command not found" errors**
   - Verify Node.js is installed: `node --version`
   - Make sure the path to your nomi-mcp-server is correct

3. **API errors**
   - Verify your Nomi API key is valid
   - Check if you have active Nomis in your account

4. **Server not showing up in Claude**
   - Make sure you restarted Claude Desktop completely
   - Check the Claude Desktop config file syntax is valid JSON
   - Look for any error messages in Claude Desktop

## What This Server Does

The Nomi AI MCP server allows Claude Desktop to interact with your Nomi AI companions through their official API. You can:

- Chat with your AI companions
- Manage multiple Nomis
- Create and manage group rooms
- Get avatar images
- Control backchanneling and other room settings

The server acts as a bridge between Claude Desktop and the Nomi AI service, giving you powerful integration capabilities.