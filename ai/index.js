import express from "express";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { setGlobalDispatcher, ProxyAgent } from 'undici';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// 中间件
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

// 配置全局代理 (Node.js 原生 fetch 支持)
const PROXY_URL = process.env.PROXY_URL || "http://127.0.0.1:7897";
if (PROXY_URL) {
  const proxyAgent = new ProxyAgent(PROXY_URL);
  setGlobalDispatcher(proxyAgent);
  console.log(`已设置全局代理: ${PROXY_URL}`);
}

const apiKey = "";

// 初始化 Google AI 客户端 (Gemini 2.0 SDK)
const ai = new GoogleGenAI({
  apiKey: apiKey,
});

// AI请求API端点
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "消息内容不能为空" });
    }
    
    console.log("收到AI请求:", message);
    
    // 使用 Gemini 2.0 Flash 模型
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });
    
    console.log("AI响应成功");
    
    res.json({
      success: true,
      response: response.text,
    });
  } catch (error) {
    console.error("AI请求错误:", error);
    
    res.status(500).json({
      success: false,
      error: error.message || "AI请求失败",
      details: error.status ? `状态码: ${error.status}` : (error.cause ? `原因: ${error.cause.message}` : undefined),
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`打开浏览器访问 http://localhost:${PORT} 使用AI助手`);
});
