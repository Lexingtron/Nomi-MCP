# Nomi AI MCP Server

A Model Context Protocol (MCP) server that integrates Nomi AI companions with Claude Desktop.

## Features

- 🤖 **Chat with Nomis**: Send messages and get responses from your AI companions
- 👥 **Room Management**: Create and manage group conversations with multiple Nomis
- 🎭 **Avatar Access**: Get avatar images from your Nomis
- ⚙️ **Full API Coverage**: Complete integration with Nomi AI's API

## Available Tools

### Nomi Management
- `list_nomis` - List all your Nomis
- `get_nomi` - Get details of a specific Nomi
- `send_message_to_nomi` - Send messages and get replies
- `get_nomi_avatar` - Get Nomi avatar URLs

### Room Management
- `list_rooms` - List all your rooms
- `create_room` - Create new rooms with multiple Nomis
- `get_room` - Get room details
- `update_room` - Update room settings
- `delete_room` - Delete rooms
- `send_room_message` - Send messages to rooms
- `request_nomi_message` - Request specific Nomis to respond

## Setup

See [SETUP-GUIDE.md](./SETUP-GUIDE.md) for detailed installation instructions.

## Quick Start

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Clone this repo and run:
   ```bash
   npm install
   npm run build
   ```
3. Add to your Claude Desktop config with your Nomi API key
4. Restart Claude Desktop

## Requirements

- Node.js 18 or higher
- Nomi AI account with API key
- Claude Desktop

## License

MIT

## Contributing

Issues and pull requests welcome!