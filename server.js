const express = require('express');
const { createWebSocketServer, broadcastPrice } = require('./src/websocket/wsServer');
const { initializePrices, setupBinanceStreams } = require('./src/services/binanceService');
const routes = require('./src/routes');

const app = express();
const wss = createWebSocketServer(8001);

// Use routes
app.use('/', routes);

// Initialize and start server
async function startServer() {
  try {
    await initializePrices();
    setupBinanceStreams((symbol, price) => broadcastPrice(wss, symbol, price));
    
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`MT4 Crypto Server running on port ${PORT}`);
      console.log(`WebSocket server running on port 8001`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
}

startServer();