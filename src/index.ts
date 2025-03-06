import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Create server instance
const server = new McpServer({
  name: "playground-mcp-server",
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

server.tool(
  "get-splitwise-expenses",
  "Fetches the splitwise expenses",
  {},
  () => {
    const expenses = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data.json"), "utf8")
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(expenses, null, 2),
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
