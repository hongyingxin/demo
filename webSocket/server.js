const WebSocket = require('ws');

// 1. 创建一个 WebSocket 服务器，监听 3001 端口
const wss = new WebSocket.Server({ port: 3001 });

console.log('WebSocket 服务已启动: ws://localhost:3001');

// --- 幂等性处理：记录已处理的消息 ID ---
// 在生产环境中，这里建议使用 Redis 并设置过期时间
const processedMessages = new Set();

// 2. 监听连接事件
wss.on('connection', (ws) => {
  console.log('有新的客户端连接了');

  // 3. 监听客户端发来的消息
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      const { type, payload, msgId } = message;

      console.log(`[Server] 收到 ${type} 消息, ID: ${msgId}`);

      switch (type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;

        case 'message':
          // --- 【核心：幂等性检查】 ---
          if (msgId && processedMessages.has(msgId)) {
            console.log(`[Server] 发现重复消息 ${msgId}，仅重发 ACK`);
            ws.send(JSON.stringify({ type: 'ack', payload: { msgId } }));
            return; // 立即返回，不执行下面的业务逻辑
          }

          // 1. 立即回复 ACK
          if (msgId) {
            ws.send(JSON.stringify({ type: 'ack', payload: { msgId } }));
            processedMessages.add(msgId); // 标记为已处理
          }

          // 2. 模拟业务处理逻辑
          setTimeout(() => {
            ws.send(JSON.stringify({ 
              type: 'message', 
              payload: `服务器已处理: ${payload}`,
              msgId: `server-${Date.now()}`
            }));
          }, 300);
          break;

        default:
          console.warn('[Server] 未知消息类型:', type);
      }
    } catch (err) {
      console.error('[Server] 非法协议', err);
    }
  });

  // 4. 监听连接断开
  ws.on('close', () => {
    console.log('客户端已断开连接');
  });

  // 初始欢迎消息
  ws.send(JSON.stringify({ type: 'system', payload: '欢迎连接到带 ACK 和幂等处理的服务器！' }));
});
