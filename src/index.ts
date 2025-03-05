import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "weather",
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
    const answer = Math.random() * (high - low) + high;
    return {
      content: [
        {
          type: "text",
          text: answer,
        },
      ],
    };
  }
);
