const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/usersdb";

// 1. READ (Consultar usuarios)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al consultar usuarios", error: error.message });
  }
});

// 2. CREATE (Registrar usuario)
app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "Usuario registrado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
});

// 3. UPDATE (Actualizar usuario por ID)
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
});

// 4. DELETE (Eliminar usuario por ID)
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado correctamente");
    app.listen(PORT, () => {
      console.log(`Servicio de Usuarios en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
}

startServer();
