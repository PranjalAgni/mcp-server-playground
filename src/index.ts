import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "random-stuff",
  version: "1.0.0",
});

server.tool(
  "generate-random-number",
  "Generate a random number in the range",
  {
    low: z.number().describe("Start of the range"),
    high: z.number().describe("End of the range"),
  },
  ({ low, high }) => {
    const answer = Math.floor(Math.random() * (high - low) + low);
    return {
      content: [
        {
          type: "text",
          text: answer.toString(),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Random stuff MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
