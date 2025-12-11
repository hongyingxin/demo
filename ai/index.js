import express from "express";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
console.log('--------------')
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

// 优先使用环境变量，如果没有则使用硬编码的 API key（仅用于测试）
// AIzaSyCigErdRpE_xiHwyMYR2rr7sfcKmrewXvM
// AIzaSyAjCdsijhVQvJPx6iyCm7nKPIoHIJUm-sY
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAjCdsijhVQvJPx6iyCm7nKPIoHIJUm-sY";

// 根据官方文档，正确初始化客户端
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
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
      details: error.status ? `状态码: ${error.status}` : undefined,
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`打开浏览器访问 http://localhost:${PORT} 使用AI助手`);
});
