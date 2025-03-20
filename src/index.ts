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

server.tool(
  "get-xkcd-meme",
  "Fetches and returns a random XKCD meme",
  {},
  async () => {
    try {
      const response = await fetch("https://xkcd.com/info.0.json");
      const latestComic = await response.json();
      const randomComicNumber = Math.floor(Math.random() * latestComic.num) + 1;
      const randomComicResponse = await fetch(`https://xkcd.com/${randomComicNumber}/info.0.json`);
      const randomComic = await randomComicResponse.json();
      
      return {
        content: [
          {
            type: "text",
            text: `Title: ${randomComic.title}\nAlt: ${randomComic.alt}\nImage: ${randomComic.img}`,
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching XKCD meme:", error);
      return {
        content: [
          {
            type: "text",
            text: "Failed to fetch XKCD meme.",
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Miscallaenous tools you can find on this MCP server");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
