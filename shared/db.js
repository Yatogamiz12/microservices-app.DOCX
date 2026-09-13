const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado exitosamente");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
