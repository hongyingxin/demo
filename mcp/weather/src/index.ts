import { McpServer, StdioServerTransport } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

// 美国国家气象局（NWS）API
const NWS_API_BASE = 'https://api.weather.gov';
const USER_AGENT = 'weather-app/1.0';

// 创建服务端实例
const server = new McpServer({
  name: 'weather',
  version: '1.0.0',
});

// 用于发起 NWS API 请求的辅助函数
async function makeNWSRequest<T>(url: string): Promise<T | null> {
  const headers = {
    'User-Agent': USER_AGENT,
    Accept: 'application/geo+json',
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error('Error making NWS request:', error);
    return null;
  }
}

interface AlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
  };
}

// 格式化预警数据
function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `事件：${props.event || '未知'}`,
    `区域：${props.areaDesc || '未知'}`,
    `严重程度：${props.severity || '未知'}`,
    `状态：${props.status || '未知'}`,
    `标题：${props.headline || '无'}`,
    '---',
  ].join('\n');
}

interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

interface AlertsResponse {
  features: AlertFeature[];
}

interface PointsResponse {
  properties: {
    forecast?: string;
  };
}

interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}

// 注册天气工具
server.registerTool(
  'get-alerts',
  {
    title: '获取天气预警',
    description: '获取美国某州的活跃天气预警信息（仅支持美国 NWS 覆盖区域）',
    inputSchema: z.object({
      state: z.string().length(2)
        .describe('两字母州代码，例如 CA（加州）、NY（纽约州）'),
    }),
  },
  async ({ state }) => {
    const stateCode = state.toUpperCase();
    const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
    const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

    if (!alertsData) {
      return {
        content: [{
          type: 'text' as const,
          text: '获取预警数据失败',
        }],
      };
    }

    const features = alertsData.features || [];

    if (features.length === 0) {
      return {
        content: [{
          type: 'text' as const,
          text: `${stateCode} 州当前无活跃天气预警`,
        }],
      };
    }

    const formattedAlerts = features.map(formatAlert);

    return {
      content: [{
        type: 'text' as const,
        text: `${stateCode} 州活跃天气预警：\n\n${formattedAlerts.join('\n')}`,
      }],
    };
  },
);

server.registerTool(
  'get-forecast',
  {
    title: '获取天气预报',
    description: '根据经纬度获取美国某地的天气预报（仅支持美国 NWS 覆盖区域）',
    inputSchema: z.object({
      latitude: z.number().min(-90).max(90)
        .describe('纬度，例如纽约约 40.71'),
      longitude: z.number().min(-180).max(180)
        .describe('经度，例如纽约约 -74.01'),
    }),
  },
  async ({ latitude, longitude }) => {
    // 获取 grid point 数据
    const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

    if (!pointsData) {
      return {
        content: [{
          type: 'text' as const,
          text: `无法获取坐标 ${latitude}, ${longitude} 的网格点数据。该位置可能不在 NWS API 支持范围内（仅支持美国境内）。`,
        }],
      };
    }

    const forecastUrl = pointsData.properties?.forecast;
    if (!forecastUrl) {
      return {
        content: [{
          type: 'text' as const,
          text: '无法从网格点数据中获取预报链接',
        }],
      };
    }

    // 获取预报数据
    const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
    if (!forecastData) {
      return {
        content: [{
          type: 'text' as const,
          text: '获取预报数据失败',
        }],
      };
    }

    const periods = forecastData.properties?.periods || [];
    if (periods.length === 0) {
      return {
        content: [{
          type: 'text' as const,
          text: '暂无可用预报时段',
        }],
      };
    }

    // 格式化预报时段
    const formattedForecast = periods.map((period: ForecastPeriod) =>
      [
        `${period.name || '未知时段'}：`,
        `温度：${period.temperature ?? '未知'}°${period.temperatureUnit || 'F'}`,
        `风力：${period.windSpeed || '未知'} ${period.windDirection || ''}`,
        `天气：${period.shortForecast || '暂无预报'}`,
        '---',
      ].join('\n'),
    );

    return {
      content: [{
        type: 'text' as const,
        text: `坐标 ${latitude}, ${longitude} 天气预报：\n\n${formattedForecast.join('\n')}`,
      }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Weather MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});