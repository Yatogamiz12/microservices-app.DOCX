const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

// Configurar proxies para redirigir tráfico a los microservicios
app.use("/users", createProxyMiddleware({ target: "http://localhost:4001", changeOrigin: true }));
app.use("/products", createProxyMiddleware({ target: "http://localhost:4002", changeOrigin: true }));
app.use("/orders", createProxyMiddleware({ target: "http://localhost:4003", changeOrigin: true }));

app.listen(3000, () => {
  console.log("API Gateway corriendo en http://localhost:3000");
});
