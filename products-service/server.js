const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/products-db";

app.get("/", (req, res) => {
  res.status(200).json({ service: "products-service", status: "running" });
});

// 1. READ (Consultar productos)
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al consultar los productos", error: error.message });
  }
});

// 2. CREATE (Crear producto)
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Producto agregado correctamente", product });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto", error: error.message });
  }
});

// 3. UPDATE (Actualizar producto por ID)
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }
    res.send(updatedProduct);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 4. DELETE (Eliminar producto por ID)
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }
    res.send({ message: "Producto eliminado", deletedProduct });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado correctamente");
    app.listen(PORT, () => {
      console.log(`Servicio de Productos en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
