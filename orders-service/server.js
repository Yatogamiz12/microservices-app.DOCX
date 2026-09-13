const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/Order");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4003;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/orders-db";

// 1. READ (Consultar pedidos)
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al consultar órdenes", error: error.message });
  }
});

// 2. CREATE (Crear pedido)
app.post("/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Pedido realizado", order });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar orden", error: error.message });
  }
});

// 3. UPDATE (Actualizar pedido por ID)
app.put("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.json({ message: "Orden actualizada", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la orden", error: error.message });
  }
});

// 4. DELETE (Eliminar pedido por ID)
app.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.json({ message: "Orden eliminada", order: deletedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden", error: error.message });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado correctamente");
    app.listen(PORT, () => {
      console.log(`Servicio de Pedidos en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
}

startServer();
