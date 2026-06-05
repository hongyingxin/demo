import Anthropic from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import readline from 'readline/promises';

const ANTHROPIC_MODEL = 'claude-sonnet-4-5';

// 客户端类
class MCPClient {
  private mcp: Client;
  private _anthropic: Anthropic | null = null;
  private transport: StdioClientTransport | null = null;
  private tools: Anthropic.Tool[] = [];

  constructor() {
    // 初始化 MCP 客户端
    this.mcp = new Client({ name: 'mcp-client-cli', version: '1.0.0' });
  }

  private get anthropic(): Anthropic {
    // 需要时再懒加载 Anthropic 客户端
    return this._anthropic ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  // 连接 MCP 服务端
  async connectToServer(serverScriptPath: string) {
    try {
      // 判断脚本类型，并选择合适的运行命令
      const isJs = serverScriptPath.endsWith('.js');
      const isPy = serverScriptPath.endsWith('.py');
      if (!isJs && !isPy) {
        throw new Error('Server script must be a .js or .py file');
      }
      const command = isPy
        ? (process.platform === 'win32' ? 'python' : 'python3')
        : process.execPath;

      // 初始化 transport，并连接到服务端
      this.transport = new StdioClientTransport({ command, args: [serverScriptPath] });
      await this.mcp.connect(this.transport);

      // 列出可用工具
      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => ({
        name: tool.name,
        description: tool.description ?? '',
        input_schema: tool.inputSchema as Anthropic.Tool.InputSchema,
      }));
      console.log('Connected to server with tools:', this.tools.map(({ name }) => name));
    } catch (e) {
      console.log('Failed to connect to MCP server: ', e);
      throw e;
    }
  }
  // 处理用户查询，并执行工具调用
  async processQuery(query: string) {
    const messages: Anthropic.MessageParam[] = [
      {
        role: 'user',
        content: query,
      },
    ];

    // 第一次调用 Claude API
    const response = await this.anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1000,
      messages,
      tools: this.tools,
    });

    // 处理 Claude 的响应，并处理工具调用
    const finalText = [];

    for (const content of response.content) {
      if (content.type === 'text') {
        finalText.push(content.text);
      } else if (content.type === 'tool_use') {
        // 执行工具调用
        const toolName = content.name;
        const toolArgs = content.input as Record<string, unknown> | undefined;
        const result = await this.mcp.callTool({
          name: toolName,
          arguments: toolArgs,
        });

        finalText.push(`[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`);

        // 从工具返回的 content blocks 中提取文本
        const toolResultText = result.content
          .filter((block) => block.type === 'text')
          .map((block) => block.text)
          .join('\n');

        // 把工具结果继续发回 Claude，让它生成最终回答
        messages.push({
          role: 'assistant',
          content: response.content,
        });
        messages.push({
          role: 'user',
          content: [{
            type: 'tool_result',
            tool_use_id: content.id,
            content: toolResultText,
          }],
        });

        // 从 Claude 获取后续回答
        const followUp = await this.anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: 1000,
          messages,
        });

        finalText.push(followUp.content[0].type === 'text' ? followUp.content[0].text : '');
      }
    }

    return finalText.join('\n');
  }
  // 聊天循环
  async chatLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      console.log('\nMCP Client Started!');
      console.log('Type your queries or "quit" to exit.');

      while (true) {
        const message = await rl.question('\nQuery: ');
        if (message.toLowerCase() === 'quit') {
          break;
        }
        const response = await this.processQuery(message);
        console.log('\n' + response);
      }
    } finally {
      rl.close();
    }
  }
  // 清理逻辑
  async cleanup() {
    await this.mcp.close();
  }
}
// 主入口
async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: node build/index.js <path_to_server_script>');
    return;
  }
  const mcpClient = new MCPClient();
  try {
    await mcpClient.connectToServer(process.argv[2]);

    // 检查是否有可用的 API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.log(
        '\nNo ANTHROPIC_API_KEY found. To query these tools with Claude, set your API key:'
        + '\n  export ANTHROPIC_API_KEY=your-api-key-here'
      );
      return;
    }

    await mcpClient.chatLoop();
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  } finally {
    await mcpClient.cleanup();
    process.exit(0);
  }
}

main();